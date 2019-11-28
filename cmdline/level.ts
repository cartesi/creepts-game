import { MapObject, LevelObject } from "../types/tower-defense";
import { GameConstants } from "../src/GameConstants";
import * as Anuto from "../engine/src";

import enemies from "../assets/config/enemies.json";
import turrets from "../assets/config/turrets.json";
import waves from "../assets/config/waves.json";

export default (map: MapObject): LevelObject => {
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
