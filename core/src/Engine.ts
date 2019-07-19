module Anuto {

    export class Engine {

        public waveActivated: boolean;
       
        private enemies: Enemy[];
        private towers: Tower[];
        private bullets: Bullet[];
        private t: number;
        private eventDispatcher: EventDispatcher;
        private enemiesSpawner: EnemiesSpawner;
     
        constructor (gameConfig: Types.GameConfig, enemyData: any, towerData: Types.TowerData[]) {
 
            GameVars.credits = gameConfig.credits;
            GameVars.timeStep = gameConfig.timeStep;

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

            this.enemies.forEach(function (enemy) {
                enemy.update();
            }); 

            this.towers.forEach(function (tower) {
                tower.update();
            }); 

            this.checkCollisions();

            this.spawnEnemies();

            GameVars.ticksCounter ++;
        }

        public newWave(waveConfig: Types.WaveConfig): void {

            GameVars.level = waveConfig.level;

            GameVars.waveTotalEnemies = waveConfig.totalEnemies;
            GameVars.enemiesCounter = 0;
            GameVars.ticksCounter = 0;

             // TODO: instanciar las torres
            this.towers = [];

            for (let i = 0; i < waveConfig.towers.length; i ++) {
               //
            }

            this.waveActivated = true;

            this.t = Date.now();
           
            this.enemies = [];
            this.bullets = [];
        }

        public removeEnemy(enemy: Enemy): void {

            const i = this.enemies.indexOf(enemy);

            if (i !== -1) {
                this.enemies.splice(i, 1);
            }

            enemy.destroy();
        }

        public addTower(type: string, p: {r: number, c: number}): Tower {

            const towerConfig: Types.TowerConfig = {
                id: type,
                level: 0,
                position: p
            };

            const tower = new Tower(towerConfig, GameVars.ticksCounter);
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

        public addBullet(bullet: Bullet): void {

            this.bullets.push(bullet);
        }

        public addEventListener(type: string, listenerFunction: Function, scope: any): void {
            
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        }

        public removeEventListener(type: string, listenerFunction): void {

            this.eventDispatcher.removeEventListener(type, listenerFunction);
        }

        private checkCollisions(): void {
            //
        }

        private spawnEnemies(): void {

            const enemy = this.enemiesSpawner.getEnemy();

            if (enemy) {

                this.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Event(Event.EVENT_ENEMY_SPAWNED, [enemy, {r: 0, c: 0}]));

                GameVars.enemiesCounter ++;
            }
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
