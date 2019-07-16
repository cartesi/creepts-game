declare module Anuto {
    class CoreEngine {
        static ticksCounter: number;
        private static enemies;
        private static towers;
        static init(): void;
        static update(): void;
        newWave(): void;
        addEnemy(enemy: Enemy): void;
        addTower(tower: Tower, p: {
            r: number;
            c: number;
        }): void;
    }
}
declare module Anuto {
    class Enemy {
        type: number;
        life: number;
        speed: number;
        constructor();
        destroy(): void;
        update(): void;
        hit(damage: number): void;
    }
}
declare module Anuto {
    class GameConstants {
    }
}
declare module Anuto {
    class GameVars {
        static credits: number;
        static score: number;
        static waveActivated: boolean;
    }
}
declare module Anuto {
    class Tower {
        type: string;
        level: number;
        damage: number;
        reload: number;
        range: number;
        constructor();
        update(): void;
        upgrade(): void;
    }
}
