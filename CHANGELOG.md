# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2023-02-09
### Changed
- udpated language server to 1.1.2
- updated OneSDK to 2.3.0

## [1.2.0] - 2022-12-22
### Added
- Superface outline view prototype - shows super.json and allows easy navigation to source files (profiles, maps, providers)

## [1.1.2] - 2022-11-10
### Fixed
- AJV resolution when packing extension https://github.com/microsoft/vscode-vsce/issues/432

## [1.1.1] - 2022-11-09
### Fixed
- Updated language-server with fix ENUM resolution

## [1.1.0] - 2022-02-11
### Added
- Configuration capability to disable the language server
- Workspace commands to start/restart and stop the language server

## [1.0.1-beta.0] - 2021-11-30

## [1.0.0] - 2021-11-05
### Changed
- Updated language-server to v1.0.0

## [0.1.6] - 2021-10-18
### Changed
- Updated language-server to v0.0.17

## [0.1.5] - 2021-09-27
### Changed
- Updated language-server to v0.0.16

## [0.1.4] - 2021-08-10

## [0.1.3] - 2021-08-06

## [0.1.2] - 2021-08-06
### Added
- JSON schemas for maps, profiles and super.json (wip)

## [0.1.1] - 2021-07-28

## [0.1.0] - 2021-07-28
### Added
- Added profile and map snippets

### Changed
- Updated language-server to v0.0.13
- Renamed `slang` to `comlink`
- Added open VSX registry publishing

## [0.0.12] - 2021-06-08
### Changed
- Updated language-server to v0.0.12

## [0.0.11] - 2021-04-26

## [0.0.11] - 2021-04-26
### Changed
- Publish to npm

## [0.0.8] - 2021-03-23
### Changed
- Updated to language server v0.0.9
- Map http call security requirement syntax highlighting

## [0.0.7] - 2021-02-04
### Added
- Iteration atom syntax highlighting
- Iteration atom syntax rule recongnition to call statement and inline call

### Changed
- Renamed `statement-condition` to `condition-atom`
- Made some easily recognizable operators include their name in the syntax name identifier

## [0.0.6] - 2021-01-11
### Changed
- Updated to language server v0.0.7

## [0.0.5] - 2021-01-09
### Changed
- Updated to language server v0.0.6

### Fixed
- Map http call response comment syntax highlighting

## [0.0.4] - 2020-12-10
### Fixed
- Highlighting of profile usecase safety
- Highlighting of inline call in http call body slot

## [0.0.3] - 2020-11-25
### Changed
- Language server dependency version
- `.vscodeignore` with and files packaged in the extension

## [0.0.2] - 2020-11-20
### Removed
- `.map.slang` and `.profile.slang` file associations

## 0.0.1-test10 - 2020-11-16
### Added
- `vsix` file release in github flow

[Unreleased]: https://github.com/superfaceai/language-client-vscode/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/superfaceai/language-client-vscode/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/superfaceai/language-client-vscode/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/superfaceai/language-client-vscode/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/superfaceai/language-client-vscode/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/superfaceai/language-client-vscode/compare/v1.0.1-beta.0...v1.1.0
[1.0.1-beta.0]: https://github.com/superfaceai/language-client-vscode/compare/v1.0.0...v1.0.1-beta.0
[1.0.0]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.6...v1.0.0
[0.1.6]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/superfaceai/language-client-vscode/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.12...v0.1.0
[0.0.12]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.11...v0.0.12
[0.0.11]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.11...v0.0.11
[0.0.11]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.8...v0.0.11
[0.0.8]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/superfaceai/language-client-vscode/compare/v0.0.1-test10...v0.0.2
