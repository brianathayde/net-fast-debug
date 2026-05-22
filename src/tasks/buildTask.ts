import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { isNodeError } from '../utils/errors';

type TasksJson = {
  version?: string;
  tasks?: Array<Record<string, unknown>>;
};

type BuildTaskOptions = {
  noRestore?: boolean;
  noDependencies?: boolean;
};

export async function ensureBuildTask(
  csprojUri: vscode.Uri,
  projectName: string,
  projectDir: string,
  csprojPath: string,
  options: BuildTaskOptions = {}
) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(csprojUri);
  const vscodeDir = path.join(workspaceFolder?.uri.fsPath ?? projectDir, '.vscode');
  const tasksPath = path.join(vscodeDir, 'tasks.json');
  const label = createTaskLabel(projectName, options);
  const task = createBuildTask(label, projectDir, csprojPath, options);

  await fs.mkdir(vscodeDir, { recursive: true });

  const tasksJson = await readTasksJson(tasksPath);
  tasksJson.version = tasksJson.version ?? '2.0.0';
  tasksJson.tasks = Array.isArray(tasksJson.tasks) ? tasksJson.tasks : [];

  upsertTask(tasksJson.tasks, task);

  await fs.writeFile(tasksPath, `${JSON.stringify(tasksJson, null, 2)}\n`, 'utf8');

  return label;
}

function createBuildTask(
  label: string,
  projectDir: string,
  csprojPath: string,
  options: BuildTaskOptions
) {
  const args = ['build', csprojPath, '--configuration', 'Debug', '--nologo'];

  if (options.noRestore) {
    args.push('--no-restore', '-clp:ErrorsOnly');
  }

  if (options.noDependencies) {
    args.push('--no-dependencies');
  }

  return {
    label,
    type: 'process',
    command: 'dotnet',
    args,
    options: {
      cwd: projectDir
    },
    problemMatcher: '$msCompile',
    presentation: {
      reveal: 'silent',
      panel: 'dedicated',
      clear: true
    }
  };
}

async function readTasksJson(tasksPath: string): Promise<TasksJson> {
  try {
    const content = await fs.readFile(tasksPath, 'utf8');
    return JSON.parse(content) as TasksJson;
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {};
    }

    throw new Error(`Could not read ${tasksPath}. Make sure the file contains valid JSON.`);
  }
}

function upsertTask(tasks: Array<Record<string, unknown>>, task: Record<string, unknown>) {
  const taskIndex = tasks.findIndex((existingTask) => existingTask.label === task.label);

  if (taskIndex >= 0) {
    tasks[taskIndex] = task;
    return;
  }

  tasks.push(task);
}

function createTaskLabel(projectName: string, options: BuildTaskOptions) {
  if (options.noRestore && options.noDependencies) {
    return `dotnet-debug-terminal: build --no-restore --no-dependencies ${projectName}`;
  }

  if (options.noRestore) {
    return `dotnet-debug-terminal: build --no-restore ${projectName}`;
  }

  return `dotnet-debug-terminal: build ${projectName}`;
}
