import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let CLIENT: LanguageClient | undefined;

export async function stopClient(): Promise<void> {
  if (CLIENT === undefined) {
    return undefined;
  }

  const result = CLIENT.stop();
  CLIENT = undefined;

  return result;
}

export async function runClient(serverModule: string, opts: { force?: boolean }): Promise<boolean> {
  if (CLIENT !== undefined) {
    if (opts.force === true) {
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
      options: {
        execArgv: ['--experimental-wasi-unstable-preview1']
      }
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=7357', '--experimental-wasi-unstable-preview1'],
      },
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { pattern: "**/*.profile.ts" },
      { pattern: "**/*.map.js" }
    ]
  };

  // Create the language client and start the client.
  CLIENT = new LanguageClient(
    'superfaceLanguageClient.languageServer',
    'Comlink Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server.
  await CLIENT.start();

  return true;
}
