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
