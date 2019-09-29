import { GameConstants } from "./GameConstants";
import { MathUtils } from "./utils/MathUtils";
import { Turret } from "./turrets/Turret";
import { Enemy } from "./enemies/Enemy";
import { Bullet } from "./turrets/Bullet";
import { Glue } from "./turrets/Glue";
import { GlueBullet } from "./turrets/GlueBullet";
import { GlueTurret } from "./turrets/GlueTurret";
import { ProjectileTurret } from "./turrets/ProjectileTurret";
import { LaserTurret } from "./turrets/LaserTurret";
import { LaunchTurret } from "./turrets/LaunchTurret";
import { Mine } from "./turrets/Mine";
import { Mortar } from "./turrets/Mortar";
import { EnemiesSpawner } from "./EnemiesSpawner"
import { Event } from "./events/Event";
import { EventDispatcher } from "./events/EventDispatcher";
import { Types } from "./Types";

    export class Engine {

        public waveActivated: boolean;
        public turrets: Turret[];
        public enemySpawningDeltaTicks: number;
        public lastWaveTick: number;
        public enemyData: any;
        public turretData: any;
        public wavesData: any;
        public waveEnemies: any;
        public waveReward: number;
        public remainingReward: number;
        public enemies: Enemy[];
        public enemiesPathCells: {r: number, c: number} [];
        public plateausCells: {r: number, c: number} [];
        public turretId: number;
        public enemyId: number;
        public bulletId: number;
        public mortarId: number;
        public glueId: number;
        public mineId: number;
        public waveDefaultHealth: number;
        public enemyHealthModifier: number;
        public enemyRewardModifier: number;
        public boardSize: {r: number, c: number};

        private runningInClientSide: boolean;
        private _version: string;
        private _credits: number;
        private _creditsEarned: number;
        private _score: number;
        private _lifes: number;
        private _paused: boolean;
        private _timeStep: number;
        private _gameOver: boolean;
        private _round: number;
        private _ticksCounter: number;
        private _bonus: number;

        private bullets: Bullet[];
        private glueBullets: GlueBullet[];
        private mortars: Mortar[];
        private mines: Mine[];
        private glues: Glue[];
        private bulletsColliding: Bullet[];
        private glueBulletsColliding: GlueBullet[];
        private mortarsImpacting: Mortar[];
        private minesImpacting: Mine[];
        private consumedGlues: Glue[];
        private teleportedEnemies: {enemy: Enemy, glueTurret: GlueTurret}[];
        private t: number;
        private eventDispatcher: EventDispatcher;
        private enemiesSpawner: EnemiesSpawner;
        private noEnemiesOnStage: boolean;
        private waveEnemiesLength: number;
        private enemiesSpawned: number;
        private allEnemiesSpawned: boolean;
        private canLaunchNextWave: boolean;

        constructor (gameConfig: Types.GameConfig, enemyData: any, turretData: any, wavesData: any) {

            this._version = GameConstants.VERSION;

            this.turretId = 0;
            this.enemyId = 0;
            this.bulletId = 0;
            this.mortarId = 0;
            this.glueId = 0;
            this.mineId = 0;
 
            this.enemySpawningDeltaTicks = gameConfig.enemySpawningDeltaTicks;
            this.runningInClientSide = gameConfig.runningInClientSide;
            this.boardSize = gameConfig.boardSize;
            this._credits = gameConfig.credits;
            this._lifes = gameConfig.lifes;
            this._paused = false;
            this._timeStep = gameConfig.timeStep;

            this.enemiesPathCells = gameConfig.enemiesPathCells;
            this.plateausCells = gameConfig.plateausCells;

            this.enemyData = enemyData;
            this.turretData = turretData;
            this.wavesData = wavesData;

            this._score = 0;
            this._gameOver = false;
            this._round = 0;
            this._bonus = 0;

            this._creditsEarned = 0;
            this.enemyHealthModifier = 1;
            this.enemyRewardModifier = 1;

            this.waveActivated = false;
            this.t = 0;

            this.eventDispatcher = new EventDispatcher();
            this.enemiesSpawner = new EnemiesSpawner(this);
         
            this._ticksCounter = 0;
            this.lastWaveTick = 0;

            this.turrets = [];
            this.mines = [];
            this.minesImpacting = [];
            this.waveEnemies = [];

            this.canLaunchNextWave = true;

            this.initWaveVars();
            this.noEnemiesOnStage = false;
            this.allEnemiesSpawned = false;
            this.enemiesSpawned = 0;
            this.waveEnemiesLength = 0;

            this.remainingReward = 0;
        }

        public initWaveVars(): void {

            this.t = Date.now();

            this.enemies = [];
            
            this.bullets = [];
            this.glueBullets = [];
            this.mortars = [];
            this.glues = [];

            this.bulletsColliding = [];
            this.glueBulletsColliding = [];
            this.mortarsImpacting = [];
            this.consumedGlues = [];
            this.teleportedEnemies = [];
        }

        public update(): void {

            if (this.runningInClientSide) {

                const t = Date.now();

                if (t - this.t < this._timeStep) {
                    return;
                }
    
                this.t = t;
            }

            if (this._paused || !this.waveActivated) {
                return;
            }

            if (this._lifes <= 0 && !this._gameOver) {

                this.eventDispatcher.dispatchEvent(new Event(Event.GAME_OVER));
                this._gameOver = true;

                console.log("TICKS: " + this._ticksCounter);
                console.log("SCORE: " + this._score);
            }

            if (this.noEnemiesOnStage && this.allEnemiesSpawned && this.bullets.length === 0 && this.glueBullets.length === 0 && this.glues.length === 0 && this.mortars.length === 0) {
                this.waveActivated = false;
                this.ageTurrets();

                if (this._lifes > 0) {
                    this.eventDispatcher.dispatchEvent(new Event(Event.WAVE_OVER));
                } else {
                    return;
                } 
            }

            if (this.ticksCounter - this.lastWaveTick >= (GameConstants.INITIAL_TICKS_WAVE * this.enemySpawningDeltaTicks) && !this.canLaunchNextWave) {
                this.canLaunchNextWave = true;
                this.eventDispatcher.dispatchEvent(new Event(Event.ACTIVE_NEXT_WAVE));
            }

            if (this.waveActivated) {
                this.removeProjectilesAndAccountDamage();
            }

            this.teleport();

            this.checkCollisions();
            this.spawnEnemies();
            
            this.enemies.forEach(function (enemy) {
                enemy.update();
            }, this); 

            this.turrets.forEach(function (turret) {
                turret.update();
            }); 

            this.bullets.forEach(function (bullet) {
                bullet.update();
            }); 

            this.glueBullets.forEach(function (bullet) {
                bullet.update();
            }); 

            this.mortars.forEach(function (mortars) {
                mortars.update();
            });

            this.mines.forEach(function (mine) {
                mine.update();
            });

            this.glues.forEach(function (glue) {
                glue.update();
            });

            this._ticksCounter ++;
        }

        public newWave(): boolean {

            if (!this.canLaunchNextWave) {
                return false;
            }

            this._credits += this._bonus;
            this._creditsEarned += this._bonus;

            this.canLaunchNextWave = false;

            this.noEnemiesOnStage = false;
            this.allEnemiesSpawned = false;

            let length = Object.keys(this.wavesData).length;
            let waveData = this.wavesData["wave_" + (this._round % length + 1)];
            
            let initialWaveEnemies = waveData.enemies.slice(0);

            let newWaveEnemies = JSON.parse(JSON.stringify(initialWaveEnemies));

            const extend = Math.floor(this._round / length);
            const extraWaves = Math.min(extend * waveData.extend, waveData.maxExtend);

            this._round++;

            for (let i = 0; i < extraWaves; i++) {

                let nextWaveEnemies = JSON.parse(JSON.stringify(initialWaveEnemies));
                let lastTickValue = newWaveEnemies[newWaveEnemies.length - 1].t;

                for (let j = 0; j < nextWaveEnemies.length; j++) {
                    nextWaveEnemies[j].t += (lastTickValue + 2);
                }

                newWaveEnemies = newWaveEnemies.concat(nextWaveEnemies);
            }

            for (let i = 0; i < newWaveEnemies.length; i++) {
                newWaveEnemies[i].t = newWaveEnemies[i].t * this.enemySpawningDeltaTicks + this._ticksCounter + 1;
            }

            this.waveEnemies = this.waveEnemies.concat(newWaveEnemies);
            this.waveEnemies = MathUtils.mergeSort(this.waveEnemies, function(e1: any , e2: any): boolean { return e1.t - e2.t < 0; });

            this.lastWaveTick = this._ticksCounter;
            
            this.waveReward = waveData.waveReward;

            this.waveActivated = true;

            this.waveEnemiesLength += newWaveEnemies.length;

            this.waveDefaultHealth = 0;
            for (let i = 0; i < this.waveEnemies.length; i++) {
                this.waveDefaultHealth += this.enemyData[this.waveEnemies[i].type].life;
                this.remainingReward += Math.round(this.enemyRewardModifier * this.enemyData[this.waveEnemies[i].type].value);
            }

            let damagePossible = Math.round(GameConstants.DIFFICULTY_LINEAR * this._creditsEarned + GameConstants.DIFFICULTY_MODIFIER * Math.pow(this._creditsEarned, GameConstants.DIFFICULTY_EXPONENT));
            let healthModifier = MathUtils.fixNumber(damagePossible / this.waveDefaultHealth);
            healthModifier = Math.max(healthModifier, GameConstants.MIN_HEALTH_MODIFIER);

            let rewardModifier = GameConstants.REWARD_MODIFIER * Math.pow(healthModifier, GameConstants.REWARD_EXPONENT);
            rewardModifier = Math.max(rewardModifier, GameConstants.MIN_REWARD_MODIFIER);

            this.enemyHealthModifier = healthModifier;
            this.enemyRewardModifier = rewardModifier;

            this._bonus = Math.round(this.waveReward + Math.round(GameConstants.EARLY_BONUS_MODIFIER * Math.pow(Math.max(0, this.remainingReward), GameConstants.EARLY_BONUS_EXPONENT)));

            return true;
        }

        public removeEnemy(enemy: Enemy): void {

            const i = this.enemies.indexOf(enemy);

            if (i !== -1) {
                this.enemies.splice(i, 1);
            }

            enemy.destroy();
        }

        public addTurret(type: string, p: {r: number, c: number}): Turret {

            // mirar si estamos poniendo la torreta encima del camino
            for (let i = 0; i < this.enemiesPathCells.length; i++) {
                if (p.c === this.enemiesPathCells[i].c && p.r === this.enemiesPathCells[i].r) {
                    return null;
                }
            }

            // mirar si ya hay una torreta
            for (let i = 0; i < this.turrets.length; i++) {
                if (p.c === this.turrets[i].position.c && p.r === this.turrets[i].position.r) {
                    return null;
                }
            }

            let isOnPlateau = false;

            // miramos si esta en una celda en la que se puede posicionar
            if (this.plateausCells.length !== 0) {
                for (let i = 0; i < this.plateausCells.length; i++) {
                    if (this.plateausCells[i].c === p.c && this.plateausCells[i].r === p.r) {
                        isOnPlateau = true;
                        break;
                    }
                }
            } else {
                isOnPlateau = true;
            }

            if (!isOnPlateau) {
                return null;
            }

            let turret: Turret = null;

            switch (type) {
                case GameConstants.TURRET_PROJECTILE:
                    turret = new ProjectileTurret(p, this);
                    break;
                case GameConstants.TURRET_LASER:
                    turret = new LaserTurret(p, this);
                    break;
                case GameConstants.TURRET_LAUNCH:
                    turret = new LaunchTurret(p, this);
                    break;
                case GameConstants.TURRET_GLUE:
                    turret = new GlueTurret(p, this);
                    break;
                default:
            }

            if (this._credits < turret.value) {
                return null;
            }

            this.turrets.push(turret);

            this._credits -= turret.value;

            return turret;
        }

        public sellTurret(id: number): boolean {

            const turret = this.getTurretById(id);

            if (!turret) {
                return false;
            }

            const i = this.turrets.indexOf(turret);

            if (i !== -1) {
                this.turrets.splice(i, 1);
            }

            this._credits += turret.sellValue;
            turret.destroy();

            return true;
        }

        public setNextStrategy(id: number): boolean {

            const turret = this.getTurretById(id);

            if (turret) {
                turret.setNextStrategy();
                return true;
            }

            return false;
        }

        public setFixedTarget(id: number): boolean {

            const turret = this.getTurretById(id);

            if (turret) {
                turret.setFixedTarget();
                return true;
            }

            return false;
        }

        public addBullet(bullet: Bullet, projectileTurret: ProjectileTurret): void {

            this.bullets.push(bullet);

            this.eventDispatcher.dispatchEvent(new Event(Event.BULLET_SHOT, [bullet, projectileTurret]));
        }

        public addGlueBullet(bullet: GlueBullet, glueTurret: GlueTurret): void {

            this.glueBullets.push(bullet);

            this.eventDispatcher.dispatchEvent(new Event(Event.GLUE_BULLET_SHOT, [bullet, glueTurret]));
        }

        public addGlue(glue: Glue, glueTurret: GlueTurret): void {

            this.glues.push(glue);

            this.eventDispatcher.dispatchEvent(new Event(Event.GLUE_SHOT, [glue, glueTurret]));
        }

        public addMortar(mortar: Mortar, launchTurret: LaunchTurret): void {

            this.mortars.push(mortar);

            this.eventDispatcher.dispatchEvent(new Event(Event.MORTAR_SHOT, [mortar, launchTurret]));
        }

        public addMine(mine: Mine, launchTurret: LaunchTurret): void {

            this.mines.push(mine);

            this.eventDispatcher.dispatchEvent(new Event(Event.MINE_SHOT, [mine, launchTurret]));
        }

        public addLaserRay(laserTurret: LaserTurret, enemies: Enemy[]): void {

            for (let i = 0; i < enemies.length; i++) {
                enemies[i].hit(laserTurret.damage, null, null, null, laserTurret);
            }

            this.eventDispatcher.dispatchEvent(new Event(Event.LASER_SHOT, [laserTurret, enemies]));
            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [[enemies]]));
        }

        public flagEnemyToTeleport(enemy: Enemy, glueTurret: GlueTurret): void {

            this.teleportedEnemies.push({enemy: enemy, glueTurret: glueTurret});
        }

        public onEnemyReachedExit(enemy: Enemy): void {

            const i = this.enemies.indexOf(enemy);

            if (i !== -1) {
                this.enemies.splice(i, 1);
            }

            this._score += enemy.value;
            this.remainingReward -= enemy.value;

            enemy.destroy();
            
            this._lifes -= 1;

            this._bonus = Math.round(this.waveReward + Math.round(GameConstants.EARLY_BONUS_MODIFIER * Math.pow(Math.max(0, this.remainingReward), GameConstants.EARLY_BONUS_EXPONENT)));

            if (this.enemies.length === 0 && this.allEnemiesSpawned) {
                this.onNoEnemiesOnStage();
            }

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_REACHED_EXIT, [enemy]));
        }

        public onEnemyKilled(enemy: Enemy): void {

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_KILLED, [enemy]));

            const i = this.enemies.indexOf(enemy);

            if (i !== -1) {
                this.enemies.splice(i, 1);
            }

            this._credits += enemy.value;
            this._creditsEarned += enemy.value;
            this._score += enemy.value;
            this.remainingReward -= enemy.value;

            enemy.destroy();

            this._bonus = Math.round(this.waveReward + Math.round(GameConstants.EARLY_BONUS_MODIFIER * Math.pow(Math.max(0, this.remainingReward), GameConstants.EARLY_BONUS_EXPONENT)));

            if (this.enemies.length === 0 && this.allEnemiesSpawned) {
                this.onNoEnemiesOnStage();
            }
        }

        public improveTurret(id: number): boolean {

            let success = false;

            const turret = this.getTurretById(id);

            if (turret && turret.level < turret.maxLevel && this._credits >= turret.priceImprovement) {
                this._credits -= turret.priceImprovement;
                turret.improve();
                success = true;
            }

            return success;
        }

        public upgradeTurret(id: number): boolean {

            let success = false;

            const turret = this.getTurretById(id);

            if (turret && turret.grade < 3 && this._credits >= turret.priceUpgrade) {
                this._credits -= turret.priceUpgrade;
                turret.upgrade();
                success = true;
            }

            return success;
        }

        public getPathPosition(l: number): {x: number, y: number} {

            let x: number;
            let y: number;

            const i = Math.floor(l);

            if (!this.enemiesPathCells[i]) {
                return null;
            }

            if (i === this.enemiesPathCells.length - 1) {

                x = this.enemiesPathCells[this.enemiesPathCells.length - 1].c;
                y = this.enemiesPathCells[this.enemiesPathCells.length - 1].r;

            } else {

                const dl = MathUtils.fixNumber(l - i);

                // interpolar entre i e i + 1
                x = this.enemiesPathCells[i].c + .5;
                y = this.enemiesPathCells[i].r + .5;
    
                const dx = MathUtils.fixNumber(this.enemiesPathCells[i + 1].c - this.enemiesPathCells[i].c);
                const dy = MathUtils.fixNumber(this.enemiesPathCells[i + 1].r - this.enemiesPathCells[i].r);
    
                x = MathUtils.fixNumber(x + dx * dl);
                y = MathUtils.fixNumber(y + dy * dl);
            }

            return {x: x, y: y};
        }

        public addEventListener(type: string, listenerFunction: Function, scope: any): void {
            
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        }

        public removeEventListener(type: string, listenerFunction): void {

            this.eventDispatcher.removeEventListener(type, listenerFunction);
        }

        private checkCollisions(): void {

            // las balas
            for (let i = 0; i < this.bullets.length; i ++) {
                
                const bullet = this.bullets[i];

                if (bullet.outOfStageBoundaries) {
                    this.bulletsColliding.push(bullet);
                } else {
                    let enemy = bullet.assignedEnemy;

                    const bp1 = {x: bullet.x, y: bullet.y};
                    const bp2 = bullet.getPositionNextTick();

                    let enemyPosition: {x: number, y: number};
                    let enemyHit: boolean;

                    // no importa si el enemigo ya ha muerto la bala se marca cuando alcanza la posicion que el enemigo muerto tuvo
                    if (enemy) {
                        
                        enemyPosition = {x: enemy.x, y: enemy.y};
                        let boundingRadius = enemy.life > 0 ? enemy.boundingRadius : 1.65 * enemy.boundingRadius;
                        enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, boundingRadius);

                        if (enemyHit) {
                            this.bulletsColliding.push(bullet);
                        }
                    } else {
                        // es una bala que tenia asiganada un enemigo que ha sido teletransportada
                        // mirar si colisiona contra otro enemigo y en este caso reasignarselo
                        // y meterla en el array de balas a eliminar
                        for (let j = 0; j < this.enemies.length; j ++) {

                            enemy = this.enemies[j];
                            enemyPosition = {x: enemy.x, y: enemy.y};

                            enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, 1.25 * enemy.boundingRadius);
    
                            if (enemyHit) {
                                bullet.assignedEnemy = enemy;
                                this.bulletsColliding.push(bullet);
                                break;
                            }
                        }
                    }
                }
            } 

            for (let i = 0; i < this.glueBullets.length; i ++) {
                
                const gluebullet = this.glueBullets[i];

                if (gluebullet.outOfStageBoundaries) {
                    this.glueBulletsColliding.push(gluebullet);
                } else {

                    let enemy = gluebullet.assignedEnemy;

                    const bp1 = {x: gluebullet.x, y: gluebullet.y};
                    const bp2 = gluebullet.getPositionNextTick();

                    let enemyPosition: {x: number, y: number};
                    let enemyHit: boolean;

                    if (enemy) {

                        enemyPosition = {x: enemy.x, y: enemy.y};

                        let boundingRadius = enemy.life > 0 ? enemy.boundingRadius : 1.65 * enemy.boundingRadius;
                        enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, boundingRadius);

                        if (enemyHit) {
                            this.glueBulletsColliding.push(gluebullet);
                        }
                    } else {

                        for (let j = 0; j < this.enemies.length; j ++) {

                            enemy = this.enemies[j];
                            enemyPosition = {x: enemy.x, y: enemy.y};

                            enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, 1.25 * enemy.boundingRadius);
    
                            if (enemyHit) {
                                gluebullet.assignedEnemy = enemy;
                                this.glueBulletsColliding.push(gluebullet);
                                break;
                            }
                        }
                    }
                }
            } 

            for (let i = 0; i < this.mortars.length; i ++) {

                if (this.mortars[i].detonate) {
                    this.mortarsImpacting.push(this.mortars[i]);
                }
            }

            for (let i = 0; i < this.mines.length; i ++) {

                if (this.mines[i].detonate) {
                    this.minesImpacting.push(this.mines[i]);
                }
            }

            for (let i = 0; i < this.glues.length; i ++) {

                if (this.glues[i].consumed) {
                    this.consumedGlues.push(this.glues[i]);
                }
            }

            for (let i = 0; i < this.enemies.length; i ++) {

                const enemy = this.enemies[i];

                if (enemy.type !== GameConstants.ENEMY_FLIER) {

                    enemy.affectedByGlue = false;

                    for (let j = 0; j < this.glues.length; j++) {
    
                        const glue = this.glues[j];
    
                        if (!glue.consumed) {
    
                            const dx = enemy.x - glue.x;
                            const dy = enemy.y - glue.y;
            
                            const squaredDist = MathUtils.fixNumber(dx * dx + dy * dy);
                            let squaredRange = MathUtils.fixNumber(glue.range * glue.range);
            
                            if (squaredRange >= squaredDist) {
                                enemy.glue(glue.intensity);
                                break; // EL EFECTO DEL PEGAMENTO NO ES ACUMULATIVO, NO HACE FALTA COMPROBAR CON MAS PEGAMENTOS
                            }
                        }
                    }
                }
            }
        }

        private removeProjectilesAndAccountDamage(): void {

            // las balas
            for (let i = 0; i < this.bulletsColliding.length; i ++) {

                const bullet = this.bulletsColliding[i];
                const enemy = bullet.assignedEnemy;

                // si el enemigo ya ha muerto o la bala ha salido del tablero
                if (bullet.outOfStageBoundaries || enemy.life === 0) {
                    this.eventDispatcher.dispatchEvent(new Event(Event.REMOVE_BULLET, [bullet]));
                } else {
                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [[enemy], bullet]));
                    enemy.hit(bullet.damage, bullet);
                }

                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
                bullet.destroy();
            }

            this.bulletsColliding.length = 0;

            // las balas de pegamento
            for (let i = 0; i < this.glueBulletsColliding.length; i ++) {

                const glueBullet = this.glueBulletsColliding[i];
                const enemy = glueBullet.assignedEnemy;

                // si el enemigo ya ha muerto o la bala ha salido del tablero
                if (glueBullet.outOfStageBoundaries || enemy.life === 0) {
                    this.eventDispatcher.dispatchEvent(new Event(Event.REMOVE_GLUE_BULLET, [glueBullet]));
                } else {
                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_GLUE_HIT, [[enemy], glueBullet]));
                    enemy.hitByGlueBullet(glueBullet.intensity, glueBullet.durationTicks);
                }

                const index = this.glueBullets.indexOf(glueBullet);
                this.glueBullets.splice(index, 1);
                glueBullet.destroy();
            }

            this.glueBulletsColliding.length = 0;
            
            // los morteros
            for (let i = 0; i < this.mortarsImpacting.length; i ++) {

                const mortar = this.mortarsImpacting[i];

                const hitEnemiesData: {enemy: Enemy, damage: number} [] = mortar.getEnemiesWithinExplosionRange();
                const hitEnemies: Enemy[] = [];

                if (hitEnemiesData.length > 0) {

                    for (let j = 0; j < hitEnemiesData.length; j ++) {

                        const enemy = hitEnemiesData[j].enemy;

                        if (enemy.life > 0) {
                            enemy.hit(hitEnemiesData[j].damage, null, mortar);
                            hitEnemies.push(enemy);
                        }
                    }
                }

                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [hitEnemies, null, mortar]));

                const index = this.mortars.indexOf(mortar);
                this.mortars.splice(index, 1);

                mortar.destroy();
            }

            this.mortarsImpacting.length = 0;

            // las minas
            for (let i = 0; i < this.minesImpacting.length; i ++) {

                const mine = this.minesImpacting[i];

                const hitEnemiesData: {enemy: Enemy, damage: number} [] = mine.getEnemiesWithinExplosionRange();
                const hitEnemies: Enemy[] = [];

                if (hitEnemiesData.length > 0) {

                    for (let j = 0; j < hitEnemiesData.length; j ++) {

                        const enemy = hitEnemiesData[j].enemy;

                        if (enemy.life > 0) {
                            enemy.hit(hitEnemiesData[j].damage, null, null, mine);
                            hitEnemies.push(enemy);
                        }
                    }
                }

                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [hitEnemies, null, null, mine]));

                const index = this.mines.indexOf(mine);
                this.mines.splice(index, 1);

                let turret = mine.turret;

                if (turret) {
                    turret.numMines--;
                }

                mine.destroy();
            }

            this.minesImpacting.length = 0;

            // los pegamentos
            for (let i = 0; i < this.consumedGlues.length; i ++) {

                const glue = this.consumedGlues[i];

                const index = this.glues.indexOf(glue);
                this.glues.splice(index, 1);

                this.eventDispatcher.dispatchEvent(new Event(Event.GLUE_CONSUMED, [glue]));
                glue.destroy();
            }  

            this.consumedGlues.length = 0;
        }

        private teleport(): void {

            const teleportedEnemiesData: {enemy: Enemy, glueTurret: GlueTurret} [] = [];
            
            for (let i = 0; i < this.teleportedEnemies.length; i ++) {

                const enemy = this.teleportedEnemies[i].enemy;
                enemy.teleport(this.teleportedEnemies[i].glueTurret.teleportDistance);
                teleportedEnemiesData.push({enemy: enemy, glueTurret: this.teleportedEnemies[i].glueTurret});
                
                // ¿hay balas que tenian asignadas este enemigo?
                for (let i = 0; i < this.bullets.length; i ++) {

                    const bullet = this.bullets[i];

                    if (bullet.assignedEnemy && bullet.assignedEnemy.id === enemy.id) {
                        bullet.assignedEnemy = null;
                    }
                }

                for (let i = 0; i < this.glueBullets.length; i ++) {

                    const glueBullet = this.glueBullets[i];

                    if (glueBullet.assignedEnemy && glueBullet.assignedEnemy.id === enemy.id) {
                        glueBullet.assignedEnemy = null;
                    }
                }
            }

            this.teleportedEnemies.length = 0;

            if (teleportedEnemiesData.length > 0) {
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMIES_TELEPORTED, [teleportedEnemiesData]));
            }
        }

        private ageTurrets(): void {

            for (let i = 0; i < this.turrets.length; i++) {
                this.turrets[i].ageTurret();
            }
        }

        private spawnEnemies(): void {

            let enemy = this.enemiesSpawner.getEnemy();

            while (enemy) {

                this.enemiesSpawned++;

                if (this.enemiesSpawned === this.waveEnemiesLength) {
                    this.allEnemiesSpawned = true;
                    this.enemiesSpawned = 0;
                    this.waveEnemiesLength = 0;
                }

                this.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_SPAWNED, [enemy, this.enemiesPathCells[0]]));

                enemy = this.enemiesSpawner.getEnemy();
            }
        }

        private onNoEnemiesOnStage(): void {

            this.noEnemiesOnStage = true;

            this._credits += this._bonus;
            this._creditsEarned += this._bonus;
            this._bonus = 0;

            this.eventDispatcher.dispatchEvent(new Event(Event.NO_ENEMIES_ON_STAGE));
        }

        private getTurretById(id: number): Turret {

            let turret: Turret = null;

            for (let i = 0; i < this.turrets.length; i ++) {
                if (this.turrets[i].id === id) {
                    turret = this.turrets[i];
                    break;
                }
            }

            return turret;
        }

        // GETTERS Y SETTERS
        public get credits(): number {
            
            return this._credits;
        }

        public get creditsEarned(): number {
            
            return this._creditsEarned;
        }

        public get bonus(): number {
            
            return this._bonus;
        }

        public get ticksCounter(): number {

            return this._ticksCounter;
        }

        public get score(): number {

            return this._score;
        }

        public get gameOver(): boolean {

            return this._gameOver;
        }

        public get lifes(): number {
            
            return this._lifes;
        }

        public get round(): number {
            
            return this._round;
        }

        public get timeStep(): number {

            return this._timeStep;
        }

        public set timeStep(value: number) {

            this._timeStep = value;
        }

        public get paused(): boolean {

            return this._paused;
        }

        public set paused(value: boolean) {

            this._paused = value;
        }

        public get version(): string {

            return this._version;
        }

        public set version(value: string) {

            this._version = value;
        }
    }

// export GameConstants, MathUtils, Turret, Enemy, Bullet, Glue, GlueBullet, GlueTurret, ProjectileTurret, LaserTurret, LaunchTurret, Mine, Mortar, EnemiesSpawner, Event, EventDispatcher, Types;
