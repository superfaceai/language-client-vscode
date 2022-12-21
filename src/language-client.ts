import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let CLIENT: LanguageClient | undefined;

export function stopClient(): undefined | Promise<void> {
  if (CLIENT === undefined) {
    return undefined;
  }

  const result = CLIENT.stop();
  CLIENT = undefined;

  return result;
}

export function runClient(serverModule: string, force?: boolean): boolean {
  if (CLIENT !== undefined) {
    if (force === true) {
      void stopClient();
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
    'Superface Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server.
  void CLIENT.start();

  return true;
}
