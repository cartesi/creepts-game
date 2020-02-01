// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { MapObject, LevelObject } from "../types/tower-defense";
import { GameConstants } from "../src/GameConstants";
import * as Creepts from "../engine/src";

import enemies from "../assets/config/enemies.json";
import turrets from "../assets/config/turrets.json";
import waves from "../assets/config/waves.json";

export default (map: MapObject): LevelObject => {
    // build level object using map and constant values
    return {
        engineVersion: Creepts.GameConstants.VERSION,
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
