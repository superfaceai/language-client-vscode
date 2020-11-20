# Superface Language client for VSCode

Extension that provides a client for the Superface Language server and syntax highlighting definitions.

## Install

Download the `.vsix` file from one of the Github releases.

Use your vscode installation to install the extension using `code --install-extension <path-to-vsix>`.

## Publishing a new version

Package publishing is done through GitHub release functionality.

[Draft a new release](https://github.com/superfaceai/language-client-vscode/releases/new) to publish a new version of the package.

Use semver for the version tag. It must be in format of `v<major>.<minor>.<patch>`.

The publish CI workflow will build and package the extension and upload it as a release asset.

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