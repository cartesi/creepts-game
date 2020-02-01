# Creepts - a Cartesi Game based on Anuto TD

A JS and Cartesi-compatible implementation of Anuto TD coded in TypeScript and using the game engine Phaser V3

## Targets

There are two webpack targets:
- `app`: game in-browser application
- `cmdline`: offline command line tools, including the engine executor

Both targets share the engine code, but webpack already bundles each target appropriately.

## NPM scripts:

- `npm run dev`: runs webpack-dev-server for the game development only (phaser);
- `npm run dev:cartesi`: runs webpack-dev-server including the React UI for Cartesi tournaments. You must have `backend` running locally;
- `npm run build`: build production assets at `dist/`
- `npm run build:game`: build production assets at `dist/` without React UI for Cartesi tournaments.
- `npm run build:app`: build only the `app` target at `dist/`
- `npm run build:cmdline`: build only the command line tools at `dist/`
- `npm run verifier -- <log.json> <level.json> --debug`: run the verifier against a log and level files using `node`
- `npm run levels -- [--numbered] [--map <index>] [--directory <path>]`: generate level files

## Contributing

Thank you for your interest in Cartesi! Head over to our [Contributing Guidelines](CONTRIBUTING.md) for instructions on how to sign our Contributors Agreement and get started with Cartesi!

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## License

This repository and all contributions are licensed under
[APACHE 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review our [LICENSE](LICENSE) file.

## Acknowledgments

- Original work
