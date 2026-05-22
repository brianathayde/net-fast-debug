import * as vscode from 'vscode';
import { debugProject } from './debugProject';

export async function noRestoreDebugInNewTerminal(uri?: vscode.Uri) {
  await debugProject(uri, { noRestore: true });
}
