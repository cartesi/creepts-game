declare namespace Anuto {
    class Bullet {
        x: number;
        y: number;
        private dx;
        private dy;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, speed: number);
        update(): void;
        getPositionNextTick(): {
            x: number;
            y: number;
        };
    }
}
declare namespace Anuto {
    class Enemy {
        id: number;
        life: number;
        speed: number;
        x: number;
        y: number;
        creationTick: number;
        constructor(id: number, creationTick: number);
        destroy(): void;
        update(): void;
        hit(damage: number): void;
    }
}
declare namespace Anuto {
    class Engine {
        static readonly EVENT_ENEMY_SPAWNED = "enemy spawned";
        ticksCounter: number;
        waveActivated: boolean;
        private enemies;
        private towers;
        private bullets;
        private t;
        private totalEnemies;
        private callbacks;
        constructor(gameConfig: Types.GameConfig);
        update(): void;
        newWave(config: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTower(type: string, p: {
            r: number;
            c: number;
        }): Tower;
        sellTower(tower: Tower): void;
        addBullet(bullet: Bullet): void;
        addEventListener(event: string, callbackFunction: Function, callbackScope: any): void;
        removeEnentListener(event: string): void;
        private checkCollisions;
        private spawnEnemies;
        private dispatchEvent;
        timeStep: number;
    }
}
declare namespace Anuto.Constants {
    const INITIAL_CREDITS = 500;
    const TOWER_1 = "tower_1";
    const TOWER_2 = "tower_2";
    const TOWER_3 = "tower_3";
    const TOWER_4 = "tower_4";
}
declare namespace Anuto {
    class GameVars {
        static credits: number;
        static score: number;
        static timeStep: number;
        static level: number;
        static boardDimensions: {
            r: number;
            c: number;
        };
        static enemiesCounter: number;
    }
}
declare namespace Anuto {
    class Tower {
        type: string;
        level: number;
        damage: number;
        reload: number;
        range: number;
        value: number;
        position: {
            r: number;
            c: number;
        };
        creationTick: number;
        constructor(config: Types.TowerConfig, creationTick: number);
        destroy(): void;
        update(): void;
        upgrade(): void;
    }
}
declare namespace Anuto.Types {
    type Callback = {
        func: Function;
        scope: any;
    };
    type GameConfig = {
        timeStep: number;
        boardSize: {
            r: number;
            c: number;
        };
    };
    type WaveConfig = {
        level: number;
        towers: TowerConfig[];
        totalEnemies: number;
    };
    type TowerConfig = {
        id: string;
        level: number;
        position: {
            r: number;
            c: number;
        };
    };
}
