import {
  NormalizedProfileProviderSettings,
  NormalizedProfileSettings,
  NormalizedProviderSettings,
} from '@superfaceai/ast';
import {
  DEFAULT_API_URL,
  detectSuperJson,
  IFileSystem,
  loadSuperJson,
  META_FILE,
  NodeFileSystem,
  normalizeSuperJsonDocument,
} from '@superfaceai/one-sdk';
import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import {
  Command,
  Event,
  EventEmitter,
  OutputChannel,
  Position,
  Range,
  TextDocumentShowOptions,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
  window,
  workspace,
} from 'vscode';

class SuperJsonLabels {
  private readonly superJsonPath: Uri;
  private readonly labels: {
    profiles: {
      [profile: string]: {
        range: Range;
        providers: {
          [provider: string]: { range: Range };
        };
      };
    };
    providers: {
      [provider: string]: { range: Range };
    };
  } = { profiles: {}, providers: {} };

  public static async fromPath(
    superJsonPath: string
  ): Promise<SuperJsonLabels> {
    const text = await workspace.fs
      .readFile(Uri.file(superJsonPath))
      .then(b => Buffer.from(b).toString('utf-8'));

    return new SuperJsonLabels(superJsonPath, text);
  }

  private constructor(superJsonPath: string, text: string) {
    this.superJsonPath = Uri.file(superJsonPath);

    const visitor: jsonc.JSONVisitor = {
      onObjectProperty: (
        property: string,
        _offset: number,
        length: number,
        startLine: number,
        startCharacter: number,
        pathSupplier: () => jsonc.JSONPath
      ) => {
        const path = pathSupplier();
        const range = new Range(
          new Position(startLine, startCharacter),
          new Position(startLine, startCharacter + length)
        );

        if (path.length == 1) {
          if (path[0] == 'profiles') {
            this.labels.profiles[property] = { range, providers: {} };
          } else if (path[0] == 'providers') {
            this.labels.providers[property] = { range };
          }
        } else if (path.length == 3) {
          if (path[0] == 'profiles' && path[2] == 'providers') {
            this.labels.profiles[path[1]].providers[property] = { range };
          }
        }
      },
    };
    jsonc.visit(text, visitor);
  }

  profile(name: string): [Uri, TextDocumentShowOptions] {
    return [
      this.superJsonPath,
      { selection: this.labels.profiles[name].range },
    ];
  }

  profileProvider(
    profile: string,
    provider: string
  ): [Uri, TextDocumentShowOptions] {
    return [
      this.superJsonPath,
      {
        selection:
          this.labels.profiles?.[profile]?.providers?.[provider]?.range,
      },
    ];
  }

  provider(name: string): [Uri, TextDocumentShowOptions] {
    return [
      this.superJsonPath,
      { selection: this.labels.providers?.[name]?.range },
    ];
  }
}

export class SuperfaceOutline implements TreeDataProvider<OutlineElement> {
  private _onDidChangeTreeData: EventEmitter<
    OutlineElement | undefined | null | void
  > = new EventEmitter<OutlineElement | undefined | null | void>();
  readonly onDidChangeTreeData: Event<
    OutlineElement | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private readonly workspaceRoot: string;
  private readonly output: OutputChannel;

  public constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
    this.output = window.createOutputChannel('Superface Outline');

    this.output.appendLine(`Initialized in ${this.workspaceRoot}`);
  }

  getTreeItem(element: OutlineElement): TreeItem | Thenable<TreeItem> {
    return element;
  }

  async getChildren(element?: OutlineElement): Promise<OutlineElement[]> {
    if (element !== undefined) {
      return element.children;
    }

    // create ad-hoc filesystem object to get around https://github.com/superfaceai/one-sdk-js/issues/315
    const fs: IFileSystem = {
      ...NodeFileSystem,
      path: {
        ...NodeFileSystem.path,
        cwd: () => this.workspaceRoot,
      },
      sync: {
        ...NodeFileSystem.sync,
      },
    };

    const superPath = await detectSuperJson(this.workspaceRoot, fs);
    if (superPath === undefined) {
      this.output.appendLine('Did not find super.json in workspace');

      return [];
    }

    const basePath = path.join(this.workspaceRoot, superPath);
    const superJsonPath = path.join(basePath, META_FILE);
    const superJson = await loadSuperJson(superJsonPath, fs);
    if (superJson.isErr()) {
      this.output.appendLine(
        `Failed to load super.json: ${superJson.error.formatLong()}`
      );
      void window.showErrorMessage('Failed to load super.json');

      return [];
    }
    const normalized = normalizeSuperJsonDocument(superJson.value);
    this.output.appendLine(`Loaded super.json from ${superJsonPath}`);

    const superJsonLabels = await SuperJsonLabels.fromPath(superJsonPath);

    return [
      new OutlineSection(
        'super.json',
        [
          new OutlineSection(
            'profiles',
            Object.entries(normalized.profiles).map(
              ([name, settings]) =>
                new OutlineProfile(name, settings, {
                  basePath,
                  labels: superJsonLabels,
                })
            )
          ),
          new OutlineSection(
            'providers',
            Object.entries(normalized.providers).map(
              ([name, settings]) =>
                new OutlineProvider(name, settings, {
                  basePath,
                  labels: superJsonLabels,
                })
            )
          ),
        ],
        {
          icon: new ThemeIcon('json'),
          command: {
            title: 'Open',
            command: 'vscode.open',
            arguments: [Uri.file(superJsonPath)],
          },
        }
      ),
    ];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

abstract class OutlineElement extends TreeItem {
  public abstract readonly children: OutlineElement[];
}

class OutlineSection extends OutlineElement {
  public readonly children: OutlineElement[];

  constructor(
    label: string,
    children: OutlineElement[],
    options: { icon?: ThemeIcon; command?: Command } = {}
  ) {
    super(label, TreeItemCollapsibleState.Collapsed);
    this.children = children;
    this.iconPath = options.icon ?? new ThemeIcon('symbol-array');
    this.command = options.command;
  }
}

class OutlineUri extends OutlineElement {
  public readonly children: OutlineElement[] = [];

  constructor(uri: Uri) {
    super(uri, TreeItemCollapsibleState.None);
    this.iconPath = new ThemeIcon('link');
    this.command = { title: 'Open', command: 'vscode.open', arguments: [uri] };
  }
}

class OutlineProfile extends OutlineElement {
  public readonly children: OutlineElement[] = [];

  constructor(
    name: string,
    settings: NormalizedProfileSettings,
    options: { basePath: string; labels: SuperJsonLabels }
  ) {
    super(name, TreeItemCollapsibleState.Collapsed);
    this.iconPath = new ThemeIcon('symbol-interface');
    this.command = {
      title: 'Definition',
      command: 'vscode.open',
      arguments: options.labels.profile(name),
    };

    let profileVersion: string | undefined = undefined;
    if ('file' in settings) {
      this.children.push(
        new OutlineUri(Uri.file(path.join(options.basePath, settings.file)))
      );
    } else {
      profileVersion = settings.version;
      this.children.push(
        new OutlineUri(Uri.parse(`${DEFAULT_API_URL}${name}`))
      );
    }

    this.children.push(
      ...Object.entries(settings.providers).map(
        ([providerName, profileProvider]) =>
          new OutlineProfileProvider(providerName, profileProvider, {
            basePath: options.basePath,
            labels: options.labels,
            profileName: name,
            profileVersion,
          })
      )
    );
  }
}

class OutlineProfileProvider extends OutlineElement {
  public readonly children: OutlineElement[] = [];

  constructor(
    name: string,
    settings: NormalizedProfileProviderSettings,
    options: {
      basePath: string;
      labels: SuperJsonLabels;
      profileName: string;
      profileVersion?: string;
    }
  ) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.iconPath = new ThemeIcon('map');
    this.command = {
      title: 'Definition',
      command: 'vscode.open',
      arguments: options.labels.profileProvider(options.profileName, name),
    };

    if ('file' in settings) {
      this.children.push(
        new OutlineUri(Uri.file(path.join(options.basePath, settings.file)))
      );
    } else if (options.profileVersion !== undefined) {
      this.children.push(
        new OutlineUri(
          Uri.parse(
            `${DEFAULT_API_URL}raw/${options.profileName}.${name}@${options.profileVersion}.suma`
          )
        )
      );
    }
  }
}

class OutlineProvider extends OutlineElement {
  public readonly children: OutlineElement[] = [];

  constructor(
    name: string,
    settings: NormalizedProviderSettings,
    options: { basePath: string; labels: SuperJsonLabels }
  ) {
    super(name, TreeItemCollapsibleState.Collapsed);
    this.iconPath = new ThemeIcon('globe');
    this.command = {
      title: 'Definition',
      command: 'vscode.open',
      arguments: options.labels.provider(name),
    };

    if (settings.file !== undefined) {
      this.children.push(
        new OutlineUri(Uri.file(path.join(options.basePath, settings.file)))
      );
    } else {
      this.children.push(
        new OutlineUri(Uri.parse(`${DEFAULT_API_URL}providers/${name}`))
      );
    }
  }
}
