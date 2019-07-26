module Anuto {

    export class EnemiesSpawner {

        constructor () {
            //
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;
            
            if (GameVars.ticksCounter % GameVars.enemySpawningDeltaTicks === 0 && GameVars.waveEnemies.length > 0) {

                const nextEnemyData = GameVars.waveEnemies[0];
                
                if (nextEnemyData.t === GameVars.ticksCounter / GameVars.enemySpawningDeltaTicks) {
                    enemy = new Enemy(nextEnemyData.type, GameVars.ticksCounter);
                    GameVars.waveEnemies.splice(0, 1);
                }
            }

            return enemy;
        }
    }
}
