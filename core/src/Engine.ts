namespace Anuto {

    export class Engine {

        public ticksCounter: number;
        public waveActivated: boolean;

        private enemies: Enemy[];
        private towers: Tower[];
        private bullets: Bullet[];
        private t: number;

        constructor (gameConfig: Types.GameConfig) {
 
            GameVars.credits = 500;

            this.waveActivated = false;
            this.t = 0;

            GameVars.timeStep = gameConfig.timeStep;

            this.towers = [];
        }

        public update(): void {

            const t = Date.now();

            if (t - this.t < GameVars.timeStep || !this.waveActivated) {
                return;
            }

            this.t = t;

            this.ticksCounter ++;

            this.enemies.forEach(function (enemy) {
                enemy.update();
            }); 

            this.towers.forEach(function (tower) {
                tower.update();
            }); 

            this.checkCollisions();

            this.spawnEnemies();
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
                type: type,
                level: 0,
                position: p
            };

            const tower = new Tower(towerConfig);
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

        private checkCollisions(): void {
            //
        }

        private spawnEnemies(): void {

            // TODO: do it when requieed

            const enemy = new Enemy();
            this.enemies.push(enemy);

            // TODO: callback to inform that an enemy has been spawned
        }

        public get timeStep(): number {

            return GameVars.timeStep;
        }

        public set timeStep(value: number) {

            GameVars.timeStep = value;
        }
    }
}
