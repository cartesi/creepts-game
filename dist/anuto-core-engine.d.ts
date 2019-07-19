declare module Anuto {
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
declare module Anuto {
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
declare module Anuto {
    class Engine {
        ticksCounter: number;
        waveActivated: boolean;
        private enemies;
        private towers;
        private bullets;
        private t;
        private totalEnemies;
        private eventDispatcher;
        constructor(gameConfig: Types.GameConfig, enemyData: Types.EnemyData[], towerData: Types.TowerData[]);
        update(): void;
        newWave(config: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTower(type: string, p: {
            r: number;
            c: number;
        }): Tower;
        sellTower(tower: Tower): void;
        addBullet(bullet: Bullet): void;
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        removeEnentListener(event: string): void;
        private checkCollisions;
        private spawnEnemies;
        timeStep: number;
    }
}
declare module Anuto.Constants {
    const INITIAL_CREDITS = 500;
    const TOWER_1 = "tower_1";
    const TOWER_2 = "tower_2";
    const TOWER_3 = "tower_3";
    const TOWER_4 = "tower_4";
}
declare module Anuto {
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
declare module Anuto {
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
declare module Anuto.Types {
    type EnemyData = {
        id: number;
        name: string;
        life: number;
        speed: number;
    };
    type TowerData = {
        id: number;
        name: string;
        price: number;
    };
    type Callback = {
        func: Function;
        scope: any;
    };
    type GameConfig = {
        timeStep: number;
        credits: number;
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
declare module Anuto {
    class Event {
        static readonly EVENT_ENEMY_SPAWNED = "enemy spawned";
        private type;
        private params;
        constructor(type: string, params: any);
        getParams(): any;
        getType(): string;
    }
}
declare module Anuto {
    class EventDispatcher {
        private listeners;
        constructor();
        hasEventListener(type: string, listener: Function): boolean;
        addEventListener(type: string, listenerFunc: Function, scope: any): void;
        removeEventListener(type: string, listenerFunc: Function): void;
        dispatchEvent(evt: Event): void;
    }
}
