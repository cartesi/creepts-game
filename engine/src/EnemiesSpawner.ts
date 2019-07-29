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
                            enemy = new Enemy(GameConstants.ENEMY_SOLDIER, GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_RUNNER:
                            enemy = new Enemy(GameConstants.ENEMY_RUNNER, GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_HEALER:
                            enemy = new HealerEnemy(GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_BLOB:
                            enemy = new Enemy(GameConstants.ENEMY_BLOB, GameVars.ticksCounter);
                            break;
                        case GameConstants.ENEMY_FLIER:
                            enemy = new Enemy(GameConstants.ENEMY_FLIER, GameVars.ticksCounter);
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
