import * as path from 'path';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

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

  context.subscriptions.push(vscode.commands.registerCommand('superfaceLanguageClient.commands.languageServer.restart', () => {
    runClient(serverModule, true);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('superfaceLanguageClient.commands.languageServer.stop', async () => {
    return stopClient();
  }));

  if (configuredView.get('superfaceLanguageClient.languageServer.enabled') === true) {
    runClient(serverModule);
  }
}

export function deactivate(): Promise<void> | undefined {
  return stopClient();
}


let CLIENT: LanguageClient | undefined;
function runClient(serverModule: string, force?: boolean): boolean {
  if (CLIENT !== undefined) {
    if (force === true) {
      stopClient();
    } else {
      return false;
    }
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=7357'],
      },
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: 'comlink-map' },
      { language: 'comlink-profile' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      // fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    },
  };

  // Create the language client and start the client.
  CLIENT = new LanguageClient(
    'superfaceLanguageClient',
    'Superface Language Client',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server.
  CLIENT.start();

  return true;
}

function stopClient(): undefined | Promise<void> {
  if (CLIENT === undefined) {
    return undefined;
  }

  const result = CLIENT.stop();
  CLIENT = undefined;
  return result;
}
