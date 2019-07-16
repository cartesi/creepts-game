declare namespace Anuto {
    class Bullet {
        private speed;
        constructor();
        update(): void;
    }
}
declare namespace Anuto {
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
declare namespace Anuto {
    class Engine {
        ticksCounter: number;
        waveActivated: boolean;
        private enemies;
        private towers;
        private bullets;
        constructor(gameConfig: Types.GameConfig);
        update(): void;
        newWave(config: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTower(type: string, p: {
            r: number;
            c: number;
        }): void;
        sellTower(tower: Tower): void;
        addBullet(bullet: Bullet): void;
        private checkCollisions;
        private spawnEnemies;
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
        static level: number;
        static cellsSize: number;
        static boardDimensions: {
            r: number;
            c: number;
        };
        static maxEnemies: number;
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
        constructor(config: Types.TowerConfig);
        destroy(): void;
        update(): void;
        upgrade(): void;
    }
}
declare namespace Anuto.Types {
    type GameConfig = {
        cellSize: number;
    };
    type WaveConfig = {
        level: number;
        towers: TowerConfig[];
        totalEnemies: number;
    };
    type TowerConfig = {
        type: string;
        level: number;
        position: {
            r: number;
            c: number;
        };
    };
}
