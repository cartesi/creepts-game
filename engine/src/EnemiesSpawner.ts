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

                    switch (nextEnemyData.type) {

                        case GameConstants.ENEMY_SOLDIER:
                            enemy = new SoldierEnemy(GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_RUNNER:
                            enemy = new RunnerEnemy(GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_HEALER:
                            enemy = new HealerEnemy(GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_BLOB:
                            enemy = new BlobEnemy(GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_FLIER:
                            enemy = new FlierEnemy(GameVars.ticksCounter);
                            break;
                        default: 
                    }
                   
                    GameVars.waveEnemies.splice(0, 1);
                }
            }

            return enemy;
        }
    }
}
