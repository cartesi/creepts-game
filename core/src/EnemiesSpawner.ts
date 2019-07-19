module Anuto {

    export class EnemiesSpawner {

        constructor () {
            //
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;
            
            if (GameVars.ticksCounter % 50 === 0 && GameVars.enemiesCounter < GameVars.waveTotalEnemies) {

                enemy = new Enemy("enemy_1", GameVars.ticksCounter);
            }

            return enemy;
        }
    }
}
