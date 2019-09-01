module Anuto {

    export class GameVars {

        public static gameOver: boolean;
        public static round: number;
        public static enemySpawningDeltaTicks: number;
        public static ticksCounter: number;
        public static lastWaveTick: number;
        public static enemyData: any;
        public static turretData: any;
        public static wavesData: any;
        public static waveEnemies: {"type": string, "t": number} [];
        public static enemiesPathCells: {r: number, c: number} [];
        public static enemies: Enemy[];
    }
}
