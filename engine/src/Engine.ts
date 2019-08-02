/// <reference path="./turrets/Turret.ts"/>
/// <reference path="./enemies/Enemy.ts"/>
module Anuto {

    export class Engine {

        public static currentInstance: Engine;

        public waveActivated: boolean;
       
        private turrets: Turret[];
        private bullets: Bullet[];
        private mortars: Mortar[];
        private glues: Glue[];
        private bulletsColliding: Bullet[];
        private mortarsImpacting: Mortar[];
        private consumedGlues: Glue[];
        private t: number;
        private eventDispatcher: EventDispatcher;
        private enemiesSpawner: EnemiesSpawner;

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
     
        constructor (gameConfig: Types.GameConfig, enemyData: any, turretData: any) {

            Engine.currentInstance = this;

            Turret.id = 0;
            Enemy.id = 0;
            Bullet.id = 0;
            Mortar.id = 0;
            Glue.id = 0;
 
            GameVars.runningInClientSide = gameConfig.runningInClientSide;
            GameVars.credits = gameConfig.credits;
            GameVars.timeStep = gameConfig.timeStep;
            GameVars.enemySpawningDeltaTicks = gameConfig.enemySpawningDeltaTicks;
            GameVars.paused = false;
            GameVars.enemiesPathCells = gameConfig.enemiesPathCells;

            GameVars.enemyData = enemyData;
            GameVars.turretData = turretData;
            
            this.waveActivated = false;
            this.t = 0;

            this.eventDispatcher = new EventDispatcher();
            this.enemiesSpawner = new EnemiesSpawner();
         
            GameVars.ticksCounter = 0;

            this.turrets = [];
            this.glues = [];
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

            this.removeProjectilesAndAccountDamage();

            this.checkCollisions();
            this.spawnEnemies();

            GameVars.enemies.forEach(function (enemy) {
                enemy.update(this.glues);
            }, this); 

            this.turrets.forEach(function (turret) {
                turret.update();
            }); 

            this.bullets.forEach(function (bullet) {
                bullet.update();
            }); 

            this.mortars.forEach(function (mortars) {
                mortars.update();
            });

            this.glues.forEach(function (glue) {
                glue.update();
            });

            GameVars.ticksCounter ++;
        }

        public newWave(waveConfig: Types.WaveConfig): void {

            GameVars.level = waveConfig.level;

            // hay q clonar el array
            GameVars.waveEnemies = waveConfig.enemies.slice(0); 
 
            GameVars.ticksCounter = 0;

            // TODO: instanciar las torres que hubiesen
            for (let i = 0; i < waveConfig.turrets.length; i ++) {
               //
            }

            this.waveActivated = true;

            this.t = Date.now();
           
            GameVars.enemies = [];
            this.bullets = [];
            this.mortars = [];

            this.bulletsColliding = [];
            this.mortarsImpacting = [];
            this.consumedGlues = [];
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

        public sellTurret(turret: Turret): void {

            const i = this.turrets.indexOf(turret);

            if (i !== -1) {
                this.turrets.splice(i, 1);
            }

            GameVars.credits += turret.value;
            turret.destroy();
        }

        public addBullet(bullet: Bullet, projectileTurret: ProjectileTurret): void {

            this.bullets.push(bullet);

            this.eventDispatcher.dispatchEvent(new Event(Event.BULLET_SHOT, [bullet, projectileTurret]));
        }

        public addGlue(glue: Glue, glueTurret: GlueTurret): void {

            this.glues.push(glue);

            this.eventDispatcher.dispatchEvent(new Event(Event.GLUE_SHOT, [glue, glueTurret]));
        }

        public addMortar(mortar: Mortar, launchTurret: LaunchTurret): void {

            this.mortars.push(mortar);

            this.eventDispatcher.dispatchEvent(new Event(Event.MORTAR_SHOT, [mortar, launchTurret]));
        }

        public addLaserRay(laserTurret: LaserTurret, enemy: Enemy): void {
            
            enemy.hit(laserTurret.damage);

            this.eventDispatcher.dispatchEvent(new Event(Event.LASER_SHOT, [laserTurret, enemy]));
            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [[enemy]]));
        }

        public onEnemyReachedExit(enemy: Enemy): void {

            const i = GameVars.enemies.indexOf(enemy);
            GameVars.enemies.splice(i, 1);
            enemy.destroy();

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_REACHED_EXIT, [enemy]));

            if (GameVars.enemies.length === 0) {
                this.waveOver();
            }
        }

        public onEnemyKilled(enemy: Enemy): void {

            GameVars.credits += enemy.value;

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_KILLED, [enemy]));

            const i = GameVars.enemies.indexOf(enemy);
            GameVars.enemies.splice(i, 1);
            enemy.destroy();

            if (GameVars.enemies.length === 0) {
                this.waveOver();
            }
        }

        public improveTurret(id: number): void {

            const turret = this.getTurretById(id);

            if (turret.level < 10 && GameVars.credits >= turret.priceImprovement) {
                GameVars.credits -= turret.priceImprovement;
                turret.improve();
            }
        }

        public upgradeTurret(id: number) {

            const turret = this.getTurretById(id);

            if (turret.grade < 3 && turret.priceImprovement) {
                GameVars.credits -= turret.priceImprovement;
                turret.upgrade();
            }
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

                const bp1 = {x: bullet.x, y: bullet.y};
                const bp2 = bullet.getPositionNextTick();
                const enemyPosition = {x: enemy.x, y: enemy.y};

                const enemyHit = MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);

                if (enemyHit) {
                    this.bulletsColliding.push(bullet);
                }
            } 

            for (let i = 0; i < this.mortars.length; i ++) {

                if (this.mortars[i].detonate) {
                    this.mortarsImpacting.push(this.mortars[i]);
                }
            }

            for (let i = 0; i < this.glues.length; i ++) {

                if (this.glues[i].consumed) {
                    this.consumedGlues.push(this.glues[i]);
                }
            }
        }

        private removeProjectilesAndAccountDamage(): void {

            // las balas
            for (let i = 0; i < this.bulletsColliding.length; i ++) {

                const bullet = this.bulletsColliding[i];
                const enemy = bullet.assignedEnemy;

                enemy.hit(bullet.damage);

                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);

                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [[enemy], bullet]));

                bullet.destroy();
            }

            this.bulletsColliding.length = 0;
            
            // los morteros
            for (let i = 0; i < this.mortarsImpacting.length; i ++) {

                const mortar = this.mortarsImpacting[i];

                const hitEnemiesData: {enemy: Enemy, damage: number} [] = mortar.getEnemiesWithinExplosionRange();
                const hitEnemies: Enemy[] = [];

                if (hitEnemiesData.length > 0) {

                    for (let j = 0; j < hitEnemiesData.length; j ++) {

                        const enemy = hitEnemiesData[j].enemy;
                        enemy.hit(hitEnemiesData[j].damage);

                        hitEnemies.push(enemy);
                    }
                }

                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [hitEnemies, null, mortar]));

                const index = this.mortars.indexOf(mortar);
                this.mortars.splice(index, 1);

                mortar.destroy();
            }

            this.mortarsImpacting.length = 0;

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

        private spawnEnemies(): void {

            const enemy = this.enemiesSpawner.getEnemy();

            if (enemy) {

                GameVars.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_SPAWNED, [enemy, GameVars.enemiesPathCells[0]]));
            }
        }

        private waveOver(): void {

            this.waveActivated = false;

            this.eventDispatcher.dispatchEvent(new Event(Event.WAVE_OVER));
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

        public get credits(): number {

            return GameVars.credits;
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
