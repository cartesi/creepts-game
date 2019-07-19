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
    };

    export type WaveConfig = {
        level: number;
        towers: TowerConfig[];
        totalEnemies: number;
    };

    export type TowerConfig = {
        id: string;
        level: number;
        position: {r: number, c: number};
    };
}
