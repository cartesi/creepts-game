
namespace Anuto {

    export class Engine {

        public static readonly EVENT_ENEMY_SPAWNED = "enemy spawned";

        public ticksCounter: number;
        public waveActivated: boolean;
       
        private enemies: Enemy[];
        private towers: Tower[];
        private bullets: Bullet[];
        private t: number;
        private totalEnemies: number;
        private callbacks: Types.Callback[];
     
        constructor (gameConfig: Types.GameConfig) {
 
            GameVars.credits = 500;

            this.waveActivated = false;
            this.t = 0;
            this.totalEnemies = 0;
            this.callbacks = [];
         
            GameVars.timeStep = gameConfig.timeStep;

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

            this.ticksCounter ++;
        }

        public newWave(config: Types.WaveConfig): void {

            GameVars.level = config.level;

            this.towers = [];

            for (let i = 0; i < config.towers.length; i ++) {
                // TODO: instanciar las torres
            }

            this.waveActivated = true;
            this.ticksCounter = 0;
            this.t = Date.now();
            this.totalEnemies = config.totalEnemies;

            GameVars.enemiesCounter = 0;
            
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

            const tower = new Tower(towerConfig, this.ticksCounter);
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

        public addEventListener(event: string, callbackFunction: Function, callbackScope: any): void {
            
            this.callbacks[event] = {func: callbackFunction, scope: callbackScope};
        }

        public removeEnentListener(event: string): void {
            //
        }

        private checkCollisions(): void {
            //
        }

        private spawnEnemies(): void {

            // de momento cada 25 ticks
            if (this.ticksCounter % 25 === 0 && GameVars.enemiesCounter < this.totalEnemies) {

                const enemy = new Enemy(1, this.ticksCounter);
                this.enemies.push(enemy);

                GameVars.enemiesCounter ++;

                this.dispatchEvent(Engine.EVENT_ENEMY_SPAWNED, [enemy, {r: 0, c: 0}]);
            }
        }

        private dispatchEvent(event: string, params?: any): void {

            const callback = this.callbacks[event];

            if (callback) {
                callback.func.apply(callback.scope, params);
            }
        }

        public get timeStep(): number {

            return GameVars.timeStep;
        }

        public set timeStep(value: number) {

            GameVars.timeStep = value;
        }
    }
}
