module Anuto {

    export class CoreEngine {

        public static ticksCounter: number;

        private static enemies: Enemy[];
        private static towers: Tower[];
        private static bullets: Bullet[];

        public static init(): void {
 
            CoreEngine.ticksCounter = 0;

            CoreEngine.towers = [];

            GameVars.credits = GameConstants.INITIAL_CREDITS;
        }

        public static update(): void {

            CoreEngine.ticksCounter ++;

            CoreEngine.enemies.forEach(function (enemy) {
                enemy.update();
            }); 

            CoreEngine.towers.forEach(function (tower) {
                tower.update();
            }); 
        }

        public newWave(): void {
            
            GameVars.waveActivated = true;

            CoreEngine.enemies = [];
            CoreEngine.bullets = [];
        }

        public addEnemy(enemy: Enemy): void {
            
            CoreEngine.enemies.push(enemy);
        }

        public removeEnemy(enemy: Enemy): void {

            const i = CoreEngine.enemies.indexOf(enemy);

            if (i !== -1) {
                CoreEngine.enemies.splice(i, 1);
            }
        }

        public addTower(tower: Tower, p: {r: number, c: number}): void {

            CoreEngine.towers.push(tower);
        }

        public sellTower(tower: Tower): void {

            const i = CoreEngine.towers.indexOf(tower);

            if (i !== -1) {
                CoreEngine.towers.splice(i, 1);
            }

            GameVars.credits += tower.value;
            tower.destroy();
        }

        public addBullet(bullet: Bullet): void {

            CoreEngine.bullets.push(bullet);
        }
    }
}
