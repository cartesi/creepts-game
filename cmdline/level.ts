import fs from 'fs';
import path from 'path';
import program from 'commander';
import { MapObject, LevelObject } from "../types/tower-defense";
import { GameConstants } from "../src/GameConstants";
import * as Anuto from "../engine/src";

import maps from "../assets/config/maps.json";
import enemies from "../assets/config/enemies.json";
import turrets from "../assets/config/turrets.json";
import waves from "../assets/config/waves.json";

const buildLevel = (map: MapObject): LevelObject => {
    // build level object using map and constant values
    return {
        engineVersion: Anuto.GameConstants.VERSION,
        gameConfig: {
            timeStep: GameConstants.TIME_STEP,
            runningInClientSide: false,
            enemySpawningDeltaTicks: GameConstants.ENEMY_SPAWNING_DELTA_TICKS,
            credits: GameConstants.INITIAL_CREDITS,
            lifes: GameConstants.INITIAL_LIFES,
            boardSize: map.size,
            enemiesPathCells : map.path,
            plateausCells: map.plateaus
        },
        enemiesData: enemies.enemies,
        turretsData: turrets.turrets,
        wavesData: waves.waves
    }
};

const one = (mapIndex: number) => {
    // check if valid index
    if (mapIndex < 0 || mapIndex >= maps.length) {
        throw new Error(`invalid map index '${mapIndex}'`);
    }

    // get map using map index
    const map: MapObject = maps[mapIndex];

    // write level object as string
    console.log(JSON.stringify(buildLevel(map)));
};

const all = (outdir: string, numbered: boolean) => {
    const names = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    const levels = maps.map(map => buildLevel(map));
    levels.forEach((level, index) => {
        const name = numbered ? index.toString() : names[index];
        const filename = path.resolve(outdir, `${name}.json`);
        fs.writeFileSync(filename, JSON.stringify(level));
    });
}

// parse command line
program.version('0.1.0');
program
    .option('-m, --map <index>', 'map index to generated to stdout', 0)
    .option('-d, --directory <path>', 'output directory of json files', './')
    .option('-n, --numbered', 'numbered files instead of named');
program.parse(process.argv);

if (program.map) {
    one(program.map)
} else {
    all(program.directory, program.numbered);
}
