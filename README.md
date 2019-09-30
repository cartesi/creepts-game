# Cartesi Anuto TD implementation

A JS and Cartesi-compatible implementation of Anuto TD coded in TypeScript and using the game engine Phaser V3

## Targets

There are two webpack targets:
- `app`: game in-browser application
- `verifier`: offline engine executor

Both targets share the engine code, but webpack already bundles each target appropriately.

## NPM scripts:

- `npm run dev`: runs webpack-dev-server for the game development only (phaser);
- `npm run dev:cartesi`: runs webpack-dev-server including the React UI for Cartesi tournaments. You must have `anuto-server` running locally;
- `npm run build`: build production assets at `dist/`
- `npm run build:app`: build only the `app` target at `dist/`
- `npm run build:verifier`: build only the `verifier` target at `dist/`
- `npm run verifier -- <log.json> <level.json>`: run the verifier against a log and level files
