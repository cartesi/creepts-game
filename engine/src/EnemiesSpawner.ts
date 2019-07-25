module Anuto {

    export class EnemiesSpawner {

        constructor () {
            //
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;
            
            if (GameVars.ticksCounter % 25 === 0 && GameVars.waveEnemies.length > 0) {

                enemy = new Enemy(GameVars.waveEnemies.shift(), GameVars.ticksCounter);
            }

            return enemy;
        }
    }
}
