module Anuto {

    export class Engine {

        public static currentInstance: Engine;

        public waveActivated: boolean;
       
        private towers: Tower[];
        private bullets: Bullet[];
        private bulletsColliding: Bullet[];
        private t: number;
        private eventDispatcher: EventDispatcher;
        private enemiesSpawner: EnemiesSpawner;
     
        constructor (gameConfig: Types.GameConfig, enemyData: any, towerData: any) {

            Engine.currentInstance = this;

            Tower.id = 0;
            Enemy.id = 0;
            Bullet.id = 0;
 
            GameVars.credits = gameConfig.credits;
            GameVars.timeStep = gameConfig.timeStep;
            GameVars.enemiesPathCells = gameConfig.enemiesPathCells;

            GameVars.enemyStartPosition = {r: GameVars.enemiesPathCells[0].r - 1, c: GameVars.enemiesPathCells[0].c};
            GameVars.enemyEndPosition = {r: GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].r + 1, c: GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].c};

            GameVars.enemyData = enemyData;
            GameVars.towerData = towerData;
            
            this.waveActivated = false;
            this.t = 0;
            GameVars.waveTotalEnemies = 0;

            this.eventDispatcher = new EventDispatcher();
            this.enemiesSpawner = new EnemiesSpawner();
         
            GameVars.ticksCounter = 0;

            this.towers = [];
        }

        public update(): void {

            const t = Date.now();

            if (t - this.t < GameVars.timeStep || !this.waveActivated) {
                return;
            }

            this.t = t;

            this.removeBullets();

            this.checkCollisions();
            this.spawnEnemies();

            GameVars.enemies.forEach(function (enemy) {
                enemy.update();
            }); 

            this.towers.forEach(function (tower) {
                tower.update();
            }); 

            this.bullets.forEach(function (bullet) {
                bullet.update();
            }); 

            GameVars.ticksCounter ++;
        }

        public newWave(waveConfig: Types.WaveConfig): void {

            GameVars.level = waveConfig.level;

            GameVars.waveTotalEnemies = waveConfig.totalEnemies;
            GameVars.enemiesCounter = 0;
            GameVars.ticksCounter = 0;

            // TODO: instanciar las torres que hubiesen

            for (let i = 0; i < waveConfig.towers.length; i ++) {
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

        public addTower(type: string, p: {r: number, c: number}): Tower {

            const tower = new Tower(type, p, GameVars.ticksCounter);
            this.towers.push(tower);

            return tower;
        }

        public sellTower(tower: Tower): void {

            const i = this.towers.indexOf(tower);

            if (i !== -1) {
                this.towers.splice(i, 1);
            }

            GameVars.credits += tower.value;
            tower.destroy();
        }

        public addBullet(bullet: Bullet, tower: Tower): void {

            this.bullets.push(bullet);

            this.eventDispatcher.dispatchEvent(new Event(Event.BULLET_SHOT, [bullet, tower]));
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

            this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_KILLED, [enemy]));
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

        private removeBullets(): void {

            if (this.bulletsColliding.length > 0) {

                for (let i = 0; i < this.bulletsColliding.length; i ++) {
                    // sacarlas del array
                    const index = this.bullets.indexOf(this.bulletsColliding[i]);
                    this.bullets.splice(index, 1);

                    this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_HIT, [this.bulletsColliding[i].assignedEnemy, this.bulletsColliding[i]]));

                    this.bulletsColliding[i].destroy();
                }

                this.bulletsColliding.length = 0;
            }
        }

        private spawnEnemies(): void {

            const enemy = this.enemiesSpawner.getEnemy();

            if (enemy) {

                GameVars.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Event(Event.ENEMY_SPAWNED, [enemy, GameVars.enemyStartPosition]));

                GameVars.enemiesCounter ++;
            }
        }

        private waveOver(): void {

            this.waveActivated = false;

            this.eventDispatcher.dispatchEvent(new Event(Event.WAVE_OVER));
        }

        public get ticksCounter(): number {

            return GameVars.ticksCounter;
        }

        public get timeStep(): number {

            return GameVars.timeStep;
        }

        public set timeStep(value: number) {

            GameVars.timeStep = value;
        }
    }
}
