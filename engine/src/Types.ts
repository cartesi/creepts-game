module Anuto.Types {

    export type TowerData = {
        id: number,
        name: string,
        price: number
    };

    export type Callback = {
        func: Function;
        scope: any
    };

    export type GameConfig = {
        timeStep: number;
        credits: number;
        boardSize: {r: number, c: number}; 
        enemiesPathCells: {r: number, c: number} [];
    };

    export type WaveConfig = {
        level: number;
        towers: any;
        totalEnemies: number;
    };
}
