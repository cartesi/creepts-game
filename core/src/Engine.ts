namespace Anuto {

    export class Engine {

        public ticksCounter: number;
        public waveActivated: boolean;

        private enemies: Enemy[];
        private towers: Tower[];
        private bullets: Bullet[];

        constructor (gameConfig: Types.GameConfig) {
 
            GameVars.credits = 500;

            this.waveActivated = false;
            GameVars.cellsSize = gameConfig.cellSize;
        }

        public update(): void {

            if (!this.waveActivated) {
                return;
            }

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
            
            this.enemies = [];
            this.bullets = [];
        }

        public removeEnemy(enemy: Enemy): void {

            const i = this.enemies.indexOf(enemy);

            if (i !== -1) {
                this.enemies.splice(i, 1);
            }
        }

        public addTower(type: string, p: {r: number, c: number}): void {

            const towerConfig: Types.TowerConfig = {
                type: type,
                level: 0,
                position: p
            };

            const tower = new Tower(towerConfig);

            this.towers.push(tower);
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

        private  spawnEnemies(): void {

            const enemy = new Enemy();
            this.enemies.push(enemy);
        }
    }
}
