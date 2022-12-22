import * as path from 'path';
import * as vscode from 'vscode';

import { runClient, stopClient } from './language-client';
import { SuperfaceOutline } from './superface-outline';

export function activate(context: vscode.ExtensionContext): void {
  const serverModule = context.asAbsolutePath(
    path.join(
      'node_modules',
      '@superfaceai',
      'language-server',
      'dist',
      'server.js'
    )
  );

  const configuredView = vscode.workspace.getConfiguration();

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
  let superfaceOutline: SuperfaceOutline | undefined = undefined;
  if (workspaceRoot !== undefined) {
    superfaceOutline = new SuperfaceOutline(workspaceRoot);

    context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        'superfaceOutline',
        superfaceOutline
      )
    );
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'superfaceLanguageClient.commands.languageServer.restart',
      () => {
        runClient(serverModule, true);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'superfaceLanguageClient.commands.languageServer.stop',
      async () => {
        return stopClient();
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'superfaceLanguageClient.commands.outline.refresh',
      () => {
        superfaceOutline?.refresh();
      }
    )
  );

  if (
    configuredView.get('superfaceLanguageClient.languageServer.enabled') ===
    true
  ) {
    runClient(serverModule);
  }
}

export function deactivate(): Promise<void> | undefined {
  return stopClient();
}
