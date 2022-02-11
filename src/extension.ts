import * as path from 'path';
import * as vscode from 'vscode';

import { runClient, stopClient } from './language-client';

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
