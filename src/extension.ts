import * as vscode from 'vscode';
import { debugInNewTerminal } from './debugInNewTerminal';

const commandId = 'dotnet-fast-debug.debugInNewTerminal';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(commandId, debugInNewTerminal);

  context.subscriptions.push(disposable);
}

export function deactivate() {}
