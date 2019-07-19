module Anuto {

    export class GameVars {

        public static credits: number;
        public static score: number;
        public static timeStep: number;
        public static ticksCounter: number;
        public static waveTotalEnemies: number;
        public static level: number;
        public static boardDimensions: {r: number, c: number};
        public static enemiesCounter: number;

        public static enemyData: any;
        public static towerData: Types.TowerData[];
        public static enemiesPathCells: {r: number, c: number} [];
        public static enemyStartPosition: {r: number, c: number};
        public static enemyEndPosition: {r: number, c: number};
    }
}
