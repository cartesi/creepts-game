# Creepts - a Cartesi Game based on Anuto TD

A JS and Cartesi-compatible implementation of Anuto TD coded in TypeScript and using the game engine Phaser V3

## Targets

There are two webpack targets:
- `app`: game in-browser application
- `cmdline`: offline command line tools, including the engine executor

Both targets share the engine code, but webpack already bundles each target appropriately.

## NPM scripts:

- `npm run dev`: runs webpack-dev-server for the game development only (phaser);
- `npm run dev:cartesi`: runs webpack-dev-server including the React UI for Cartesi tournaments. You must have `anuto-server` running locally;
- `npm run build`: build production assets at `dist/`
- `npm run build:game`: build production assets at `dist/` without React UI for Cartesi tournaments.
- `npm run build:app`: build only the `app` target at `dist/`
- `npm run build:cmdline`: build only the command line tools at `dist/`
- `npm run verifier -- <log.json> <level.json>`: run the verifier against a log and level files using `node`
- `npm run levels -- [--numbered] [--map <index>] [--directory <path>]`: generate level files
