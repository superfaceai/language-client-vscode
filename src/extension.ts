import * as path from 'path';
import {
  // workspace,
  ExtensionContext,
} from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext): void {
  const serverModule = context.asAbsolutePath(
    path.join(
      'node_modules',
      '@superfaceai',
      'language-server',
      'dist',
      'server.js'
    )
  );

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
      { language: 'slang-map' },
      { language: 'slang-profile' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      // fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'superfaceLanguageClient',
    'Superface Language Client',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }

  return client.stop();
}
