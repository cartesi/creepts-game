module Anuto.Types {

    export type Callback = {
        func: Function;
        scope: any
    };

    export type GameConfig = {
        timeStep: number;
        runningInClientSide: boolean;
        credits: number;
        boardSize: {r: number, c: number}; 
        enemiesPathCells: {r: number, c: number} [];
    };

    export type WaveConfig = {
        level: number;
        turrets: any;
        enemies: string[];
    };
}
