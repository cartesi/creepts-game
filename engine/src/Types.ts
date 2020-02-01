// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { Turret } from "./turrets/Turret";

    export type Callback = {
        func: Function;
        scope: any
    };

    export type GameConfig = {
        timeStep: number;
        runningInClientSide: boolean;
        enemySpawningDeltaTicks: number;
        credits: number;
        lifes: number;
        boardSize: {r: number, c: number}; 
        enemiesPathCells: {r: number, c: number} [];
        plateausCells: {r: number, c: number} [];
    };

    export type WaveConfig = {
        enemies: {"type": string, "t": number} [];
    };

    export type EngineReturn = {

        success: boolean;
        turret?: Turret;
        error?: {type: string, info?: any};
    };
