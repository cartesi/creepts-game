import * as yargs from "yargs";
import fs from 'fs';
import { MapObject, LevelObject } from "../types/tower-defense";
import { GameConstants } from "../src/GameConstants";
import * as Anuto from "../engine/src";

import maps from "../assets/config/maps.json";
import enemies from "../assets/config/enemies.json";
import turrets from "../assets/config/turrets.json";
import waves from "../assets/config/waves.json";

// parse command line
const argv = yargs
    .options({
        map: { type: 'number', default: 0 }
    })
    .help()
    .argv;

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

const all = (outdir: string) => {
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
        const name = names[index];
        fs.writeFileSync(`${outdir}${name}.json`, JSON.stringify(level));
    });
}

if (argv.map) {
    one(argv.map)
} else {
    all('./');
}
