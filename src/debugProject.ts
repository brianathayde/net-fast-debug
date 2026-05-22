import * as path from 'path';
import * as vscode from 'vscode';
import { launchDebugger } from './debugger/launchDebugger';
import { resolveBuildOutput } from './dotnet/buildOutput';
import { ensureBuildTask } from './tasks/buildTask';

type DebugProjectOptions = {
  noRestore?: boolean;
  noDependencies?: boolean;
};

export async function debugProject(uri: vscode.Uri | undefined, options: DebugProjectOptions = {}) {
  const csprojUri = uri ?? vscode.window.activeTextEditor?.document.uri;

  if (!csprojUri || path.extname(csprojUri.fsPath).toLowerCase() !== '.csproj') {
    vscode.window.showWarningMessage('Select a .csproj file to start debugging.');
    return;
  }

  const csprojPath = csprojUri.fsPath;
  const projectDir = path.dirname(csprojPath);
  const projectName = path.basename(csprojPath, '.csproj');

  try {
    const buildTaskLabel = await ensureBuildTask(csprojUri, projectName, projectDir, csprojPath, options);
    const output = await resolveBuildOutput(csprojPath);

    await launchDebugger(csprojUri, projectName, projectDir, output, buildTaskLabel);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Could not start debugging ${projectName}: ${message}`);
  }
}
