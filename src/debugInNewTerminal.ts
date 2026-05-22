import * as vscode from 'vscode';
import { debugProject } from './debugProject';

export async function debugInNewTerminal(uri?: vscode.Uri) {
  await debugProject(uri);
}
