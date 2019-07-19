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
    class EnemiesSpawner {
        constructor();
        getEnemy(): Enemy;
    }
}
declare module Anuto {
    class Enemy {
        static id: number;
        type: string;
        id: number;
        life: number;
        speed: number;
        x: number;
        y: number;
        creationTick: number;
        constructor(type: string, creationTick: number);
        destroy(): void;
        update(): void;
        hit(damage: number): void;
    }
}
declare module Anuto {
    class Engine {
        static currentInstance: Engine;
        waveActivated: boolean;
        private enemies;
        private towers;
        private bullets;
        private t;
        private eventDispatcher;
        private enemiesSpawner;
        constructor(gameConfig: Types.GameConfig, enemyData: any, towerData: Types.TowerData[]);
        update(): void;
        newWave(waveConfig: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTower(type: string, p: {
            r: number;
            c: number;
        }): Tower;
        sellTower(tower: Tower): void;
        addBullet(bullet: Bullet): void;
        onEnemyReachedExit(enemy: Enemy): void;
        onEnemyKilled(enemy: Enemy): void;
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        private checkCollisions;
        private spawnEnemies;
        readonly ticksCounter: number;
        timeStep: number;
    }
}
declare module Anuto.Constants {
}
declare module Anuto {
    class GameVars {
        static credits: number;
        static score: number;
        static timeStep: number;
        static ticksCounter: number;
        static enemyData: any;
        static towerData: Types.TowerData[];
        static waveTotalEnemies: number;
        static level: number;
        static boardDimensions: {
            r: number;
            c: number;
        };
        static enemiesCounter: number;
        static enemiesPathCells: {
            r: number;
            c: number;
        }[];
        static enemyStartPosition: {
            r: number;
            c: number;
        };
        static enemyEndPosition: {
            r: number;
            c: number;
        };
    }
}
declare module Anuto {
    class Tower {
        static id: number;
        id: number;
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
        enemiesPathCells: {
            r: number;
            c: number;
        }[];
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
        static readonly EVENT_ENEMY_KILLED = "enemy killed";
        static readonly EVENT_ENEMY_REACHED_EXIT = "enemy reached exit";
        private type;
        private params;
        constructor(type: string, params?: any);
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
