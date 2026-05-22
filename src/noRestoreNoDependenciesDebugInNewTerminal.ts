import * as vscode from 'vscode';
import { debugProject } from './debugProject';

export async function noRestoreNoDependenciesDebugInNewTerminal(uri?: vscode.Uri) {
  await debugProject(uri, { noRestore: true, noDependencies: true });
}
