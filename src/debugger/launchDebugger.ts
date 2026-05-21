import * as vscode from 'vscode';
import { BuildOutput } from '../dotnet/buildOutput';

type DebugConsoleOption = 'internalConsole' | 'integratedTerminal' | 'externalTerminal';

export async function launchDebugger(
  csprojUri: vscode.Uri,
  projectName: string,
  projectDir: string,
  output: BuildOutput,
  preLaunchTask: string
) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(csprojUri);
  const consoleOption = getDebugConsoleOption();
  const started = await vscode.debug.startDebugging(workspaceFolder, {
    name: `Debug ${projectName}`,
    type: 'coreclr',
    request: 'launch',
    program: output.dllPath,
    args: [],
    cwd: projectDir,
    console: consoleOption,
    preLaunchTask,
    stopAtEntry: false,
    justMyCode: true
  });

  if (started) {
    vscode.window.showInformationMessage(
      `Debug started for ${projectName} (${output.targetFramework}) using ${describeConsoleOption(consoleOption)}.`
    );
  } else {
    vscode.window.showWarningMessage(`VS Code did not start debugging ${projectName}.`);
  }
}

function getDebugConsoleOption(): DebugConsoleOption {
  const configuration = vscode.workspace.getConfiguration('dotnetFastDebug');
  const platformKey = process.platform === 'win32' ? 'windowsConsole' : 'unixConsole';
  const configuredOption = configuration.get<DebugConsoleOption>(platformKey);

  if (configuredOption) {
    return configuredOption;
  }

  return 'integratedTerminal';
}

function describeConsoleOption(consoleOption: DebugConsoleOption) {
  switch (consoleOption) {
    case 'internalConsole':
      return 'the debug console';
    case 'externalTerminal':
      return 'an external terminal';
    default:
      return 'the integrated terminal';
  }
}
