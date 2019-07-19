module Anuto {

    export class EnemiesSpawner {

        constructor () {
            //
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;
            
            if (GameVars.ticksCounter % 25 === 0 && GameVars.enemiesCounter < GameVars.waveTotalEnemies) {

                enemy = new Enemy(1, GameVars.ticksCounter);
            }

            return enemy;
        }
    }
}
