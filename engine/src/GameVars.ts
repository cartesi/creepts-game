module Anuto {

    export class GameVars {

        public static credits: number;
        public static score: number;
        public static timeStep: number;
        public static enemySpawningDeltaTicks: number;
        public static ticksCounter: number;
        public static runningInClientSide: boolean;
        public static paused: boolean;
        public static enemyData: any;
        public static turretData: any;
        public static waveEnemies: {"type": string, "t": number} [];
        public static level: number;
        public static boardDimensions: {r: number, c: number};
        public static enemiesPathCells: {r: number, c: number} [];
        public static enemies: Enemy[];
    }
}
