declare module Anuto {
    class Bullet {
        static id: number;
        id: number;
        x: number;
        y: number;
        assignedEnemy: Enemy;
        damage: number;
        private vx;
        private vy;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, assignedEnemy: Enemy, damage: number);
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
    class Turret {
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
        protected f: number;
        protected reloadTicks: number;
        protected readyToShoot: boolean;
        protected justShot: boolean;
        constructor(type: string, p: {
            r: number;
            c: number;
        }, creationTick: number);
        destroy(): void;
        update(): void;
        upgrade(): void;
        protected shoot(): void;
        protected getEnemiesWithinRange(): {
            enemy: Enemy;
            squareDist: number;
        }[];
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
        value: number;
        boundingRadius: number;
        protected l: number;
        protected enemyData: any;
        constructor(type: string, creationTick: number);
        destroy(): void;
        update(): void;
        hit(damage: number): void;
        restoreHealth(): void;
        getNextPosition(deltaTicks: number): {
            x: number;
            y: number;
        };
    }
}
declare module Anuto {
    class Engine {
        static currentInstance: Engine;
        waveActivated: boolean;
        private turrets;
        private bullets;
        private bulletsColliding;
        private t;
        private eventDispatcher;
        private enemiesSpawner;
        static getPathPosition(l: number): {
            x: number;
            y: number;
        };
        constructor(gameConfig: Types.GameConfig, enemyData: any, turretData: any);
        update(): void;
        newWave(waveConfig: Types.WaveConfig): void;
        removeEnemy(enemy: Enemy): void;
        addTurret(type: string, p: {
            r: number;
            c: number;
        }): Turret;
        sellTurret(turret: Turret): void;
        addBullet(bullet: Bullet, turret: Turret): void;
        onEnemyReachedExit(enemy: Enemy): void;
        onEnemyKilled(enemy: Enemy): void;
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        private checkCollisions;
        private removeBulletsAndAccountDamage;
        private spawnEnemies;
        private waveOver;
        readonly ticksCounter: number;
        readonly credits: number;
        timeStep: number;
        paused: boolean;
    }
}
declare module Anuto {
    class GameConstants {
        static readonly RELOAD_BASE_TICKS = 10;
        static readonly BULLET_SPEED = 0.5;
        static readonly ENEMY_SOLDIER = "soldier";
        static readonly ENEMY_RUNNER = "runner";
        static readonly ENEMY_HEALER = "healer";
        static readonly ENEMY_BLOB = "blob";
        static readonly ENEMY_FLIER = "flier";
        static readonly TURRET_PROJECTILE = "projectile";
        static readonly TURRET_LASER = "laser";
        static readonly TURRET_LAUNCH = "launch";
        static readonly TURRET_GLUE = "glue";
        static readonly HEALER_HEALING_TICKS = 100;
        static readonly HEALER_STOP_TICKS = 30;
        static readonly HEALER_HEALING_RADIUS = 2;
    }
}
declare module Anuto {
    class GameVars {
        static credits: number;
        static score: number;
        static timeStep: number;
        static enemySpawningDeltaTicks: number;
        static ticksCounter: number;
        static runningInClientSide: boolean;
        static paused: boolean;
        static enemyData: any;
        static turretData: any;
        static waveEnemies: {
            "type": string;
            "t": number;
        }[];
        static level: number;
        static boardDimensions: {
            r: number;
            c: number;
        };
        static enemiesPathCells: {
            r: number;
            c: number;
        }[];
        static enemies: Enemy[];
    }
}
declare module Anuto.Types {
    type Callback = {
        func: Function;
        scope: any;
    };
    type GameConfig = {
        timeStep: number;
        runningInClientSide: boolean;
        enemySpawningDeltaTicks: number;
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
        turrets: any;
        enemies: {
            "type": string;
            "t": number;
        }[];
    };
}
declare module Anuto {
    class BlobEnemy extends Enemy {
        constructor(creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class FlierEnemy extends Enemy {
        constructor(creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class HealerEnemy extends Enemy {
        healing: boolean;
        private f;
        constructor(creationTick: number);
        update(): void;
        private heal;
    }
}
declare module Anuto {
    class RunnerEnemy extends Enemy {
        constructor(creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class SoldierEnemy extends Enemy {
        constructor(creationTick: number);
        update(): void;
    }
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
    class GlueTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        }, creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class LaserTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        }, creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class LaunchTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        }, creationTick: number);
        update(): void;
    }
}
declare module Anuto {
    class ProjectileTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        }, creationTick: number);
        update(): void;
        protected shoot(): void;
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
