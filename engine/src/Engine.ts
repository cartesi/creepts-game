/// <reference path="./turrets/Turret.ts"/>
/// <reference path="./enemies/Enemy.ts"/>

module Anuto {

    export class Engine {

        public static currentInstance: Engine;

        public waveActivated: boolean;
       
        private turrets: Turret[];
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

        public static getPathPosition(l: number): {x: number, y: number} {

            let x: number;
            let y: number;

            const i = Math.floor(l);

            if (i === GameVars.enemiesPathCells.length - 1) {

                x = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].c;
                y = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].r;

            } else {

                const dl = MathUtils.fixNumber(l - i);

                // interpolar entre i e i + 1
                x = GameVars.enemiesPathCells[i].c + .5;
                y = GameVars.enemiesPathCells[i].r + .5;
    
                const dx = MathUtils.fixNumber(GameVars.enemiesPathCells[i + 1].c - GameVars.enemiesPathCells[i].c);
                const dy = MathUtils.fixNumber(GameVars.enemiesPathCells[i + 1].r - GameVars.enemiesPathCells[i].r);
    
                x = MathUtils.fixNumber(x + dx * dl);
                y = MathUtils.fixNumber(y + dy * dl);
            }

            return {x: x, y: y};
        }
     
        constructor (gameConfig: Types.GameConfig, enemyData: any, turretData: any, wavesData: any) {

            Engine.currentInstance = this;

            Turret.id = 0;
            Enemy.id = 0;
            Bullet.id = 0;
            Mortar.id = 0;
            Glue.id = 0;
            Mine.id = 0;
 
            GameVars.runningInClientSide = gameConfig.runningInClientSide;
            GameVars.credits = gameConfig.credits;
            GameVars.lifes = gameConfig.lifes;

            GameVars.timeStep = gameConfig.timeStep;
            GameVars.enemySpawningDeltaTicks = gameConfig.enemySpawningDeltaTicks;
            GameVars.paused = false;
            GameVars.enemiesPathCells = gameConfig.enemiesPathCells;

            GameVars.enemyData = enemyData;
            GameVars.turretData = turretData;
            GameVars.wavesData = wavesData;

            GameVars.round = 0;
            GameVars.score = 0;
            GameVars.gameOver = false;
            
            this.waveActivated = false;
            this.t = 0;

            this.eventDispatcher = new EventDispatcher();
            this.enemiesSpawner = new EnemiesSpawner();
         
            GameVars.ticksCounter = 0;
            GameVars.lastWaveTick = 0;

            this.turrets = [];
            this.mines = [];
            this.minesImpacting = [];
        }

        public update(): void {

            if (GameVars.runningInClientSide) {

                const t = Date.now();

                if (t - this.t < GameVars.timeStep) {
                    return;
                }
    
                this.t = t;
            }

            if (!this.waveActivated || GameVars.paused) {
                return;
            }

            if (this.noEnemiesOnStage && this.allEnemiesSpawned && this.bullets.length === 0 && this.glueBullets.length === 0 && this.glues.length === 0 && this.mortars.length === 0) {
                this.waveActivated = false;

                if (GameVars.lifes > 0) {
                    this.eventDispatcher.dispatchEvent(new Event(Event.WAVE_OVER));
                } else {
                    GameVars.gameOver = true;
                    this.eventDispatcher.dispatchEvent(new Event(Event.GAME_OVER));
                    return;
                }
            }

            this.removeProjectilesAndAccountDamage();

            this.teleport();

            this.checkCollisions();
            this.spawnEnemies();

            GameVars.enemies.forEach(function (enemy) {
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

            GameVars.ticksCounter ++;
        }

        public newWave(): void {

            let length = Object.keys(GameVars.wavesData).length;
            
            GameVars.waveEnemies = GameVars.wavesData["wave_" + (GameVars.round % length + 1)].slice(0); 
            GameVars.round++;

            GameVars.lastWaveTick = GameVars.ticksCounter;

            this.waveActivated = true;

            this.t = Date.now();
           
            GameVars.enemies = [];
            this.bullets = [];
            this.glueBullets = [];
            this.mortars = [];
            this.glues = [];

            this.bulletsColliding = [];
            this.glueBulletsColliding = [];
            this.mortarsImpacting = [];
            this.consumedGlues = [];
            this.teleportedEnemies = [];

            this.noEnemiesOnStage = false;
            this.allEnemiesSpawned = false;
            this.enemiesSpawned = 0;
            this.waveEnemiesLength = GameVars.waveEnemies.length;
        }

        public removeEnemy(enemy: Enemy): void {

            const i = GameVars.enemies.indexOf(enemy);

            if (i !== -1) {
                GameVars.enemies.splice(i, 1);
            }

            enemy.destroy();
        }

        public addTurret(type: string, p: {r: number, c: number}): Turret {

            // TODO: comprobar q se puede poner una torreta o sea no hay torreta ni camino y que hay creditos suficientes
            // mandar null o hacer saltar un error
            let turret: Turret = null;

            switch (type) {
                case GameConstants.TURRET_PROJECTILE:
                    turret = new ProjectileTurret(p);
                    break;
                case GameConstants.TURRET_LASER:
                    turret = new LaserTurret(p);
                    break;
                case GameConstants.TURRET_LAUNCH:
                    turret = new LaunchTurret(p);
                    break;
                case GameConstants.TURRET_GLUE:
                    turret = new GlueTurret(p);
                    break;
                default:
            }

            this.turrets.push(turret);

            GameVars.credits -= turret.value;

            return turret;
        }

        public sellTurret(id: number): void {

            const turret = this.getTurretById(id);
            const i = this.turrets.indexOf(turret);

            if (i !== -1) {
                this.turrets.splice(i, 1);
            }

            GameVars.credits += turret.value;
            turret.destroy();
        }

        public setNextStrategy(id: number): void {

            const turret = this.getTurretById(id);
            turret.setNextStrategy();
        }

        public setFixedTarget(id: number): void {

            const turret = this.getTurretById(id);
            turret.setFixedTarget();
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

            // ¿hay balas que tenian asignadas a este enemigo?
            for (let i = 0; i < this.bullets.length; i ++) {

                const bullet = this.bullets[i];

                if (bullet.assignedEnemy.id === enemy.id && this.bulletsColliding.indexOf(bullet) === -1) {
                    bullet.assignedEnemy = null;
                    this.bulletsColliding.push(bullet);
                }
            }

            for (let i = 0; i < this.glueBullets.length; i ++) {

                const bullet = this.glueBullets[i];

                if (bullet.assignedEnemy.id === enemy.id && this.glueBulletsColliding.indexOf(bullet) === -1) {
                    bullet.assignedEnemy = null;
                    this.glueBulletsColliding.push(bullet);
                }
            }
        }

        public onEnemyReachedExit(enemy: Enemy): void {

            const i = GameVars.enemies.indexOf(enemy);
            GameVars.enemies.splice(i, 1);
            enemy.destroy();

            GameVars.lifes -= 1;

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_REACHED_EXIT, [enemy]));

            if (GameVars.enemies.length === 0) {
                this.onNoEnemiesOnStage();
            }
        }

        public onEnemyKilled(enemy: Enemy): void {

            GameVars.credits += enemy.value;
            GameVars.score += enemy.value;

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_KILLED, [enemy]));

            const i = GameVars.enemies.indexOf(enemy);
            GameVars.enemies.splice(i, 1);
            enemy.destroy();

            if (GameVars.enemies.length === 0) {
                this.onNoEnemiesOnStage();
            }
        }

        public improveTurret(id: number): boolean {

            let success = false;

            const turret = this.getTurretById(id);

            if (turret.level < turret.maxLevel && GameVars.credits >= turret.priceImprovement) {
                GameVars.credits -= turret.priceImprovement;
                turret.improve();
                success = true;
            }

            return success;
        }

        public upgradeTurret(id: number): boolean {

            let success = false;

            const turret = this.getTurretById(id);

            if (turret.grade < 3 && GameVars.credits >= turret.priceUpgrade) {
                GameVars.credits -= turret.priceUpgrade;
                turret.upgrade();
                success = true;
            }

            return success;
        }

        public addEventListener(type: string, listenerFunction: Function, scope: any): void {
            
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        }

        public removeEventListener(type: string, listenerFunction): void {

            this.eventDispatcher.removeEventListener(type, listenerFunction);
        }

        private checkCollisions(): void {

            for (let i = 0; i < this.bullets.length; i ++) {
                
                const bullet = this.bullets[i];
                const enemy = this.bullets[i].assignedEnemy;

                if (enemy.life === 0) {
                    this.bulletsColliding.push(bullet);
                } else {
                    const bp1 = {x: bullet.x, y: bullet.y};
                    const bp2 = bullet.getPositionNextTick();
                    const enemyPosition = {x: enemy.x, y: enemy.y};

                    const enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);

                    if (enemyHit) {
                        this.bulletsColliding.push(bullet);
                    }
                } 
            } 

            for (let i = 0; i < this.glueBullets.length; i ++) {
                
                const bullet = this.glueBullets[i];
                const enemy = this.glueBullets[i].assignedEnemy;

                const bp1 = {x: bullet.x, y: bullet.y};
                const bp2 = bullet.getPositionNextTick();
                const enemyPosition = {x: enemy.x, y: enemy.y};

                const enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);

                if (enemyHit) {
                    this.glueBulletsColliding.push(bullet);
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

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const enemy = GameVars.enemies[i];

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

                if (enemy === null || enemy.life === 0) {
                    // ya esta muerto o el enemigo ha sido teletransportado
                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [[], bullet]));
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

                const bullet = this.glueBulletsColliding[i];
                const enemy = bullet.assignedEnemy;

                if (enemy === null || enemy.life === 0) {
                    // ya esta muerto o el enemigo ha sido teletransportado
                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_GLUE_HIT, [[], bullet]));
                } else {
                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_GLUE_HIT, [[enemy], bullet]));
                    enemy.glueHit(bullet.intensity, bullet.durationTicks, bullet);
                }

                const index = this.glueBullets.indexOf(bullet);
                this.glueBullets.splice(index, 1);
                bullet.destroy();
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

                let turret = this.getTurretById(mine.turretId) as LaunchTurret;

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
            }

            this.teleportedEnemies.length = 0;

            if (teleportedEnemiesData.length > 0) {
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMIES_TELEPORTED, [teleportedEnemiesData]));
            }
        }

        private spawnEnemies(): void {

            const enemy = this.enemiesSpawner.getEnemy();

            if (enemy) {

                this.enemiesSpawned++;
                if (this.enemiesSpawned === this.waveEnemiesLength) {
                    this.allEnemiesSpawned = true;
                }

                GameVars.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_SPAWNED, [enemy, GameVars.enemiesPathCells[0]]));
            }
        }

        private onNoEnemiesOnStage(): void {

            this.noEnemiesOnStage = true;

            // nos cargamos de golpe todas las balas si las hubieren
            for (let i = 0; i < this.bullets.length; i ++) {
                const bullet = this.bullets[i];
                bullet.assignedEnemy = null;
                this.bulletsColliding.push(bullet);
            }        

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

        public get ticksCounter(): number {

            return GameVars.ticksCounter;
        }

        public get score(): number {

            return GameVars.score;
        }

        public get gameOver(): boolean {

            return GameVars.gameOver;
        }

        public get credits(): number {
            
            return GameVars.credits;
        }

        public get lifes(): number {
            
            return GameVars.lifes;
        }

        public get round(): number {
            
            return GameVars.round;
        }

        public get timeStep(): number {

            return GameVars.timeStep;
        }

        public set timeStep(value: number) {

            GameVars.timeStep = value;
        }

        public set paused(value: boolean) {

            GameVars.paused = value;
        }
    }
}

