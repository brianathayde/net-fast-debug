import * as vscode from 'vscode';
import { debugInNewTerminal } from './debugInNewTerminal';
import { noRestoreDebugInNewTerminal } from './noRestoreDebugInNewTerminal';
import { noRestoreNoDependenciesDebugInNewTerminal } from './noRestoreNoDependenciesDebugInNewTerminal';

const commandId = 'dotnet-fast-debug.debugInNewTerminal';
const noRestoreCommandId = 'dotnet-fast-debug.noRestoreDebugInNewTerminal';
const noRestoreNoDependenciesCommandId =
  'dotnet-fast-debug.noRestoreNoDependenciesDebugInNewTerminal';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(commandId, debugInNewTerminal);
  const noRestoreDisposable = vscode.commands.registerCommand(
    noRestoreCommandId,
    noRestoreDebugInNewTerminal
  );
  const noRestoreNoDependenciesDisposable = vscode.commands.registerCommand(
    noRestoreNoDependenciesCommandId,
    noRestoreNoDependenciesDebugInNewTerminal
  );

  context.subscriptions.push(disposable, noRestoreDisposable, noRestoreNoDependenciesDisposable);
}

export function deactivate() {}
