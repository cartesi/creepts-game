declare module Anuto {
    class EnemiesSpawner {
        private engine;
        constructor(engine: Engine);
        getEnemy(): Enemy;
    }
}
declare module Anuto {
    class Turret {
        static readonly DOWNGRADE_PERCENT = 0.97;
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
        sellValue: number;
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
        protected projectileSpeed: number;
        protected engine: Engine;
        constructor(type: string, p: {
            r: number;
            c: number;
        }, engine: Engine);
        destroy(): void;
        update(): void;
        ageTurret(): void;
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
        type: string;
        id: number;
        life: number;
        maxLife: number;
        speed: number;
        x: number;
        y: number;
        prevX: number;
        prevY: number;
        creationTick: number;
        value: number;
        boundingRadius: number;
        l: number;
        affectedByGlue: boolean;
        glueIntensity: number;
        affectedByGlueBullet: boolean;
        glueBulletIntensity: number;
        glueBulletDurationTicks: number;
        hasBeenTeleported: boolean;
        teleporting: boolean;
        modifiers: {
            [key: string]: string;
        };
        protected enemyData: any;
        protected t: number;
        protected engine: Engine;
        protected glueTicksCounter: number;
        constructor(type: string, creationTick: number, engine: Engine);
        destroy(): void;
        update(): void;
        teleport(teleportDistance: number): void;
        hitByGlueBullet(glueBulletIntensity: number, glueBulletsDurationTicks: number): void;
        glue(glueIntensity: number): void;
        hit(damage: number, bullet?: Bullet, mortar?: Mortar, mine?: Mine, laserTurret?: LaserTurret): void;
        restoreHealth(): void;
        getNextPosition(deltaTicks: number): {
            x: number;
            y: number;
        };
    }
}
declare module Anuto {
    class Engine {
        waveActivated: boolean;
        turrets: Turret[];
        enemySpawningDeltaTicks: number;
        lastWaveTick: number;
        enemyData: any;
        turretData: any;
        wavesData: any;
        waveEnemies: any;
        waveReward: number;
        remainingReward: number;
        enemies: Enemy[];
        enemiesPathCells: {
            r: number;
            c: number;
        }[];
        plateausCells: {
            r: number;
            c: number;
        }[];
        turretId: number;
        enemyId: number;
        bulletId: number;
        mortarId: number;
        glueId: number;
        mineId: number;
        waveDefaultHealth: number;
        enemyHealthModifier: number;
        enemyRewardModifier: number;
        boardSize: {
            r: number;
            c: number;
        };
        private runningInClientSide;
        private _version;
        private _credits;
        private _creditsEarned;
        private _score;
        private _lifes;
        private _paused;
        private _timeStep;
        private _gameOver;
        private _round;
        private _ticksCounter;
        private _bonus;
        private bullets;
        private glueBullets;
        private mortars;
        private mines;
        private glues;
        private bulletsColliding;
        private glueBulletsColliding;
        private mortarsImpacting;
        private minesImpacting;
        private consumedGlues;
        private teleportedEnemies;
        private t;
        private eventDispatcher;
        private enemiesSpawner;
        private noEnemiesOnStage;
        private waveEnemiesLength;
        private enemiesSpawned;
        private allEnemiesSpawned;
        private canLaunchNextWave;
        constructor(gameConfig: Types.GameConfig, enemyData: any, turretData: any, wavesData: any);
        initWaveVars(): void;
        update(): void;
        newWave(): boolean;
        removeEnemy(enemy: Enemy): void;
        addTurret(type: string, p: {
            r: number;
            c: number;
        }): Turret;
        sellTurret(id: number): boolean;
        setNextStrategy(id: number): boolean;
        setFixedTarget(id: number): boolean;
        addBullet(bullet: Bullet, projectileTurret: ProjectileTurret): void;
        addGlueBullet(bullet: GlueBullet, glueTurret: GlueTurret): void;
        addGlue(glue: Glue, glueTurret: GlueTurret): void;
        addMortar(mortar: Mortar, launchTurret: LaunchTurret): void;
        addMine(mine: Mine, launchTurret: LaunchTurret): void;
        addLaserRay(laserTurret: LaserTurret, enemies: Enemy[]): void;
        flagEnemyToTeleport(enemy: Enemy, glueTurret: GlueTurret): void;
        onEnemyReachedExit(enemy: Enemy): void;
        onEnemyKilled(enemy: Enemy): void;
        improveTurret(id: number): boolean;
        upgradeTurret(id: number): boolean;
        getPathPosition(l: number): {
            x: number;
            y: number;
        };
        addEventListener(type: string, listenerFunction: Function, scope: any): void;
        removeEventListener(type: string, listenerFunction: any): void;
        private checkCollisions;
        private removeProjectilesAndAccountDamage;
        private teleport;
        private ageTurrets;
        private spawnEnemies;
        private onNoEnemiesOnStage;
        private getTurretById;
        readonly credits: number;
        readonly creditsEarned: number;
        readonly bonus: number;
        readonly ticksCounter: number;
        readonly score: number;
        readonly gameOver: boolean;
        readonly lifes: number;
        readonly round: number;
        timeStep: number;
        paused: boolean;
        version: string;
    }
}
declare module Anuto {
    class GameConstants {
        static readonly VERSION = "v0.11.12.15";
        static readonly RELOAD_BASE_TICKS = 10;
        static readonly BULLET_SPEED = 0.85;
        static readonly MORTAR_SPEED = 0.45;
        static readonly INITIAL_TICKS_WAVE = 4;
        static readonly ENEMY_SOLDIER = "soldier";
        static readonly ENEMY_RUNNER = "runner";
        static readonly ENEMY_HEALER = "healer";
        static readonly ENEMY_BLOB = "blob";
        static readonly ENEMY_FLIER = "flier";
        static readonly TURRET_PROJECTILE = "projectile";
        static readonly TURRET_LASER = "laser";
        static readonly TURRET_LAUNCH = "launch";
        static readonly TURRET_GLUE = "glue";
        static readonly STRATEGY_SHOOT_FIRST = "first";
        static readonly STRATEGY_SHOOT_LAST = "last";
        static readonly STRATEGY_SHOOT_CLOSEST = "closest";
        static readonly STRATEGY_SHOOT_WEAKEST = "weakest";
        static readonly STRATEGY_SHOOT_STRONGEST = "strongest";
        static readonly STRATEGIES_ARRAY: string[];
        static readonly HEALER_HEALING_TICKS = 200;
        static readonly HEALER_STOP_TICKS = 5;
        static readonly HEALER_HEALING_RADIUS = 2;
        static readonly DIFFICULTY_MODIFIER = 0.0008;
        static readonly DIFFICULTY_EXPONENT = 1.9;
        static readonly DIFFICULTY_LINEAR = 20;
        static readonly MIN_HEALTH_MODIFIER = 0.5;
        static readonly REWARD_MODIFIER = 0.4;
        static readonly REWARD_EXPONENT = 0.5;
        static readonly MIN_REWARD_MODIFIER = 1;
        static readonly EARLY_BONUS_MODIFIER = 3;
        static readonly EARLY_BONUS_EXPONENT = 0.6;
        static readonly WEAK_AGAINST_DAMAGE_MODIFIER = 3;
        static readonly STRONG_AGAINST_DAMAGE_MODIFIER = 0.33;
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
        lifes: number;
        boardSize: {
            r: number;
            c: number;
        };
        enemiesPathCells: {
            r: number;
            c: number;
        }[];
        plateausCells: {
            r: number;
            c: number;
        }[];
    };
    type WaveConfig = {
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
        constructor(creationTick: number, engine: Engine);
        update(): void;
        private heal;
    }
}
declare module Anuto {
    class Event {
        static readonly ENEMY_SPAWNED = "enemy spawned";
        static readonly ENEMY_KILLED = "enemy killed";
        static readonly ENEMY_HIT = "enemy hit by bullet";
        static readonly ENEMY_GLUE_HIT = "enemy hit by glue bullet";
        static readonly ENEMY_REACHED_EXIT = "enemy reached exit";
        static readonly ACTIVE_NEXT_WAVE = "active next wave";
        static readonly WAVE_OVER = "wave over";
        static readonly GAME_OVER = "game over";
        static readonly NO_ENEMIES_ON_STAGE = "no enemies on stage";
        static readonly BULLET_SHOT = "bullet shot";
        static readonly GLUE_BULLET_SHOT = "glue bullet shot";
        static readonly LASER_SHOT = "laser shot";
        static readonly MORTAR_SHOT = "mortar shot";
        static readonly MINE_SHOT = "mine shot";
        static readonly GLUE_SHOT = "glue shot";
        static readonly GLUE_CONSUMED = "glue consumed";
        static readonly ENEMIES_TELEPORTED = "enemies teleported";
        static readonly REMOVE_BULLET = "remove bullet";
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
        id: number;
        x: number;
        y: number;
        assignedEnemy: Enemy;
        damage: number;
        canonShoot: string;
        turret: ProjectileTurret;
        outOfStageBoundaries: boolean;
        private engine;
        private vx;
        private vy;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, assignedEnemy: Enemy, damage: number, canonShoot: string, turret: ProjectileTurret, engine: Engine);
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
        }, intensity: number, duration: number, range: number, engine: Engine);
        destroy(): void;
        update(): void;
    }
}
declare module Anuto {
    class GlueBullet {
        id: number;
        x: number;
        y: number;
        assignedEnemy: Enemy;
        intensity: number;
        durationTicks: number;
        canonShoot: string;
        private vx;
        private vy;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, assignedEnemy: Enemy, intensity: number, durationTicks: number, engine: Engine);
        destroy(): void;
        update(): void;
        getPositionNextTick(): {
            x: number;
            y: number;
        };
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
        }, engine: Engine);
        update(): void;
        protected calculateTurretParameters(): void;
        protected shoot(): void;
    }
}
declare module Anuto {
    class LaserTurret extends Turret {
        constructor(p: {
            r: number;
            c: number;
        }, engine: Engine);
        protected calculateTurretParameters(): void;
        protected getEnemiesWithinLine(enemy: Enemy): Enemy[];
        protected shoot(): void;
    }
}
declare module Anuto {
    class LaunchTurret extends Turret {
        explosionRange: number;
        numMines: number;
        private minesCounter;
        constructor(p: {
            r: number;
            c: number;
        }, engine: any);
        update(): void;
        protected calculateTurretParameters(): void;
        protected getPathCellsInRange(): {
            r: number;
            c: number;
        }[];
        protected shoot(): void;
    }
}
declare module Anuto {
    class Mine {
        id: number;
        x: number;
        y: number;
        explosionRange: number;
        range: number;
        damage: number;
        detonate: boolean;
        turret: LaunchTurret;
        private engine;
        constructor(p: {
            r: number;
            c: number;
        }, explosionRange: number, damage: number, turret: LaunchTurret, engine: Engine);
        destroy(): void;
        update(): void;
        getEnemiesWithinExplosionRange(): {
            enemy: Enemy;
            damage: number;
        }[];
    }
}
declare module Anuto {
    class Mortar {
        id: number;
        x: number;
        y: number;
        ticksToImpact: number;
        detonate: boolean;
        explosionRange: number;
        creationTick: number;
        grade: number;
        turret: LaunchTurret;
        private vx;
        private vy;
        private f;
        private damage;
        private engine;
        constructor(p: {
            r: number;
            c: number;
        }, angle: number, ticksToImpact: number, explosionRange: number, damage: number, grade: number, turret: LaunchTurret, engine: Engine);
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
        private canonShoot;
        constructor(p: {
            r: number;
            c: number;
        }, engine: Engine);
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
        static mergeSort(list: any[], compareFunction?: Function): any[];
        private static splitList;
        private static jointLists;
    }
}
