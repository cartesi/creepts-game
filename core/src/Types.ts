namespace Anuto.Types {

    export type GameConfig = {
        timeStep: number;
        boardSize: {r: number, c: number};
    };

    export type WaveConfig = {
        level: number;
        towers: TowerConfig[];
        totalEnemies: number;
    };

    export type TowerConfig = {
        type: string;
        level: number;
        position: {r: number, c: number};
    };
}
