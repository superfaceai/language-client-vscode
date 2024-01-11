import * as path from 'path';
import * as vscode from 'vscode';

import { runClient, stopClient } from './language-client';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const serverModule = context.asAbsolutePath(
    path.join(
      'dist',
      'node_modules',
      '@superfaceai',
      'language-server',
      'dist',
      'server.js'
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'superfaceLanguageClient.commands.languageServer.restart',
      () => {
        runClient(serverModule, { force: true })
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'superfaceLanguageClient.commands.languageServer.stop',
      () => stopClient()
    )
  );

  const config = vscode.workspace.getConfiguration('superfaceLanguageClient')
  if (config.get('languageServer.enabled') === true) {
    await runClient(serverModule, {});
  }
}

export async function deactivate(): Promise<void> {
  return stopClient();
}
