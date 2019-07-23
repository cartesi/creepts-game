declare module Anuto {
    class Bullet {
        static id: number;
        id: number;
        x: number;
        y: number;
        assignedEnemy: Enemy;
        private vx;
        private vy;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, assignedEnemy: Enemy);
        destroy(): void;
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
        boundingRadius: number;
        private l;
        constructor(type: string, creationTick: number);
        destroy(): void;
        update(): void;
        hit(damage: number): void;
        getNextPosition(ticks: number): {
            x: number;
            y: number;
        };
    }
}
declare module Anuto {
    class Engine {
        static currentInstance: Engine;
        waveActivated: boolean;
        private towers;
        private bullets;
        private bulletsColliding;
        private t;
        private eventDispatcher;
        private enemiesSpawner;
        static getPathPosition(l: number): {
            x: number;
            y: number;
        };
        constructor(gameConfig: Types.GameConfig, enemyData: any, towerData: any);
        update(): void;
        newWave(waveConfig: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTower(type: string, p: {
            r: number;
            c: number;
        }): Tower;
        sellTower(tower: Tower): void;
        addBullet(bullet: Bullet, tower: Tower): void;
        onEnemyReachedExit(enemy: Enemy): void;
        onEnemyKilled(enemy: Enemy): void;
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        private checkCollisions;
        private removeBullets;
        private spawnEnemies;
        private waveOver;
        readonly ticksCounter: number;
        timeStep: number;
    }
}
declare module Anuto {
    class GameConstants {
        static readonly RELOAD_BASE_TICKS = 10;
        static readonly BULLET_SPEED = 0.5;
    }
}
declare module Anuto {
    class GameVars {
        static credits: number;
        static score: number;
        static timeStep: number;
        static ticksCounter: number;
        static enemyData: any;
        static towerData: any;
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
        static enemies: Enemy[];
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
        x: number;
        y: number;
        creationTick: number;
        enemyWithinRange: Enemy;
        private f;
        private reloadTicks;
        constructor(type: string, p: {
            r: number;
            c: number;
        }, creationTick: number);
        destroy(): void;
        update(): void;
        upgrade(): void;
        private shoot;
        private getEnemyWithinRange;
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
        towers: any;
        totalEnemies: number;
    };
}
declare module Anuto {
    class Event {
        static readonly ENEMY_SPAWNED = "enemy spawned";
        static readonly ENEMY_KILLED = "enemy killed";
        static readonly ENEMY_HIT = "enemy hit";
        static readonly ENEMY_REACHED_EXIT = "enemy reached exit";
        static readonly WAVE_OVER = "wave over";
        static readonly BULLET_SHOT = "bullet shot";
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
declare module Anuto {
    class MathUtils {
        static fixNumber(n: number): number;
        static isLineSegmentIntersectingCircle(p1: {
            x: number;
            y: number;
        }, p2: {
            x: number;
            y: number;
        }, c: {
            x: number;
            y: number;
        }, r: number): boolean;
        static isPointInLineSegment(x1: number, y1: number, x2: number, y2: number, px: number, py: number): boolean;
        static isPointInsideCircle(x: number, y: number, cx: number, cy: number, r: number): boolean;
    }
}
