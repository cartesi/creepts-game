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
        creationTick: number;
        type: string;
        level: number;
        maxLevel: number;
        grade: number;
        x: number;
        y: number;
        damage: number;
        reload: number;
        range: number;
        inflicted: number;
        priceImprovement: number;
        priceUpgrade: number;
        value: number;
        position: {
            r: number;
            c: number;
        };
        shootingStrategy: string;
        shootingStrategyIndex: number;
        fixedTarget: boolean;
        enemiesWithinRange: Enemy[];
        followedEnemy: Enemy;
        shootAngle: number;
        protected f: number;
        protected reloadTicks: number;
        protected readyToShoot: boolean;
        constructor(type: string, p: {
            r: number;
            c: number;
        });
        destroy(): void;
        update(): void;
        improve(): void;
        upgrade(): void;
        setNextStrategy(): void;
        setFixedTarget(): void;
        protected calculateTurretParameters(): void;
        protected shoot(): void;
        protected getEnemiesWithinRange(): Enemy[];
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
        l: number;
        affectedByGlue: boolean;
        glueIntensity: number;
        hasBeenTeleported: boolean;
        teleporting: boolean;
        protected enemyData: any;
        protected t: number;
        constructor(type: string, creationTick: number);
        destroy(): void;
        update(): void;
        teleport(teleportDistance: number): void;
        glue(glueIntensity: number): void;
        hit(damage: number, bullet?: Bullet, mortar?: Mortar, laserTurret?: LaserTurret): void;
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
        private mortars;
        private glues;
        private bulletsColliding;
        private mortarsImpacting;
        private consumedGlues;
        private teleportedEnemies;
        private t;
        private eventDispatcher;
        private enemiesSpawner;
        private noEnemiesOnStage;
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
        setNextStrategy(id: number): void;
        setFixedTarget(id: number): void;
        addBullet(bullet: Bullet, projectileTurret: ProjectileTurret): void;
        addGlue(glue: Glue, glueTurret: GlueTurret): void;
        addMortar(mortar: Mortar, launchTurret: LaunchTurret): void;
        addLaserRay(laserTurret: LaserTurret, enemy: Enemy): void;
        flagEnemyToTeleport(enemy: Enemy, glueTurret: GlueTurret): void;
        onEnemyReachedExit(enemy: Enemy): void;
        onEnemyKilled(enemy: Enemy): void;
        improveTurret(id: number): boolean;
        upgradeTurret(id: number): boolean;
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        private checkCollisions;
        private removeProjectilesAndAccountDamage;
        private teleport;
        private spawnEnemies;
        private onNoEnemiesOnStage;
        private getTurretById;
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
        static readonly MORTAR_SPEED = 0.1;
        static readonly ENEMY_SOLDIER = "soldier";
        static readonly ENEMY_RUNNER = "runner";
        static readonly ENEMY_HEALER = "healer";
        static readonly ENEMY_BLOB = "blob";
        static readonly ENEMY_FLIER = "flier";
        static readonly TURRET_PROJECTILE = "projectile";
        static readonly TURRET_LASER = "laser";
        static readonly TURRET_LAUNCH = "launch";
        static readonly TURRET_GLUE = "glue";
        static readonly STRATEGY_SHOOT_FIRST = "First";
        static readonly STRATEGY_SHOOT_LAST = "Last";
        static readonly STRATEGY_SHOOT_CLOSEST = "Closest";
        static readonly STRATEGY_SHOOT_WEAKEST = "Weakest";
        static readonly STRATEGY_SHOOT_STRONGEST = "Strongest";
        static readonly STRATEGYS_ARRAY: string[];
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
    class HealerEnemy extends Enemy {
        healing: boolean;
        private f;
        constructor(creationTick: number);
        update(): void;
        private heal;
    }
}
declare module Anuto {
    class Event {
        static readonly ENEMY_SPAWNED = "enemy spawned";
        static readonly ENEMY_KILLED = "enemy killed";
        static readonly ENEMY_HIT = "enemy hit by bullet";
        static readonly ENEMY_REACHED_EXIT = "enemy reached exit";
        static readonly WAVE_OVER = "wave over";
        static readonly NO_ENEMIES_ON_STAGE = "no enemies on stage";
        static readonly BULLET_SHOT = "bullet shot";
        static readonly LASER_SHOT = "laser shot";
        static readonly MORTAR_SHOT = "mortar shot";
        static readonly GLUE_SHOT = "glue shot";
        static readonly GLUE_CONSUMED = "glue consumed";
        static readonly ENEMIES_TELEPORTED = "enemies teleported";
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
    class Glue {
        static id: number;
        id: number;
        x: number;
        y: number;
        intensity: number;
        duration: number;
        range: number;
        consumed: boolean;
        private f;
        constructor(p: {
            r: number;
            c: number;
        }, intensity: number, duration: number, range: number);
        destroy(): void;
        update(): void;
    }
}
declare module Anuto {
    class GlueTurret extends Turret {
        intensity: number;
        teleportDistance: number;
        duration: number;
        durationTicks: number;
        constructor(p: {
            r: number;
            c: number;
        });
        protected calculateTurretParameters(): void;
        protected shoot(): void;
    }
}
declare module Anuto {
    class LaserTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        });
        update(): void;
        protected calculateTurretParameters(): void;
        protected shoot(): void;
    }
}
declare module Anuto {
    class LaunchTurret extends Turret {
        private static deviationRadius;
        private static deviationAngle;
        explosionRange: number;
        constructor(p: {
            r: number;
            c: number;
        });
        protected calculateTurretParameters(): void;
        protected shoot(): void;
    }
}
declare module Anuto {
    class Mortar {
        static id: number;
        id: number;
        x: number;
        y: number;
        ticksToImpact: number;
        detonate: boolean;
        explosionRange: number;
        creationTick: number;
        private vx;
        private vy;
        private f;
        private damage;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, ticksToImpact: number, explosionRange: number, damage: number);
        destroy(): void;
        update(): void;
        getEnemiesWithinExplosionRange(): {
            enemy: Enemy;
            damage: number;
        }[];
    }
}
declare module Anuto {
    class ProjectileTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        });
        update(): void;
        protected calculateTurretParameters(): void;
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
