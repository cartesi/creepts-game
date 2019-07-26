module Anuto {

    export class Engine {

        public static currentInstance: Engine;

        public waveActivated: boolean;
       
        private turrets: Turret[];
        private bullets: Bullet[];
        private bulletsColliding: Bullet[];
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

            this.removeBulletsAndAccountDamage();

            this.checkCollisions();
            this.spawnEnemies();

            GameVars.enemies.forEach(function (enemy) {
                enemy.update();
            }); 

            this.turrets.forEach(function (turret) {
                turret.update();
            }); 

            this.bullets.forEach(function (bullet) {
                bullet.update();
            }); 

            GameVars.ticksCounter ++;
        }

        public newWave(waveConfig: Types.WaveConfig): void {

            GameVars.level = waveConfig.level;

            GameVars.waveEnemies = waveConfig.enemies;
            GameVars.ticksCounter = 0;

            // TODO: instanciar las torres que hubiesen

            for (let i = 0; i < waveConfig.turrets.length; i ++) {
               //
            }

            this.waveActivated = true;

            this.t = Date.now();
           
            GameVars.enemies = [];
            this.bullets = [];
            this.bulletsColliding = [];
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

            const turret = new Turret(type, p, GameVars.ticksCounter);
            this.turrets.push(turret);

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

        public addBullet(bullet: Bullet, turret: Turret): void {

            this.bullets.push(bullet);

            this.eventDispatcher.dispatchEvent(new Event(Event.BULLET_SHOT, [bullet, turret]));
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

            const i = GameVars.enemies.indexOf(enemy);
            GameVars.enemies.splice(i, 1);
            enemy.destroy();

            GameVars.credits += enemy.value;

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_KILLED, [enemy]));

            if (GameVars.enemies.length === 0) {
                this.waveOver();
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
        }

        private removeBulletsAndAccountDamage(): void {

            if (this.bulletsColliding.length > 0) {

                for (let i = 0; i < this.bulletsColliding.length; i ++) {

                    const bullet = this.bulletsColliding[i];
                    const enemy = bullet.assignedEnemy;

                    enemy.hit(bullet.damage);

                    const index = this.bullets.indexOf(bullet);
                    this.bullets.splice(index, 1);

                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [enemy, bullet]));

                    bullet.destroy();
                }

                this.bulletsColliding.length = 0;
            }
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
