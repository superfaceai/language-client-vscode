# Superface Language client for VSCode

Extension that provides a client for the Superface Language server and syntax highlighting definitions.

## Install

To install the package, first create `.npmrc` file in your project root and put the following line into it.

```
@superfaceai:registry=https://npm.pkg.github.com
```

Then authenticate to github npm package registry. Use your github name as your login and generate a personal access token with at least the `read:packages` permission in Github to use as password:

```
npm login --registry=https://npm.pkg.github.com
```

After doing this, you should be able to install the package by calling:

```
yarn add @superfaceai/language-client-vscode
```

## Publishing a new version

Package publishing is done through GitHub release functionality.

[Draft a new release](https://github.com/superfaceai/language-client-vscode/releases/new) to publish a new version of the package.

Use semver for the version tag. It must be in format of `v<major>.<minor>.<patch>`.

TODO: For now no package or vscode extensions are published anywhere.

## Licensing

Licenses of `node_modules` are checked during push CI/CD for every commit. Only the following licenses are allowed:

- 0BDS
- MIT
- Apache-2.0
- ISC
- BSD-3-Clause
- BSD-2-Clause
- CC-BY-4.0
- CC-BY-3.0;BSD
- CC0-1.0
- Unlicense
- UNLICENSED