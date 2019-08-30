module Anuto {

    export class EnemiesSpawner {

        private engine: Engine;

        constructor (engine: Engine) {
            
            this.engine = engine;
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;

            let partialTicks = GameVars.ticksCounter - GameVars.lastWaveTick;
            
            if (partialTicks % GameVars.enemySpawningDeltaTicks === 0 && GameVars.waveEnemies.length > 0) {

                const nextEnemyData = GameVars.waveEnemies[0];
                
                if (nextEnemyData.t === partialTicks / GameVars.enemySpawningDeltaTicks) {

                    switch (nextEnemyData.type) {

                        case GameConstants.ENEMY_SOLDIER:
                            enemy = new Enemy(GameConstants.ENEMY_SOLDIER, GameVars.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_RUNNER:
                            enemy = new Enemy(GameConstants.ENEMY_RUNNER, GameVars.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_HEALER:
                            enemy = new HealerEnemy(GameVars.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_BLOB:
                            enemy = new Enemy(GameConstants.ENEMY_BLOB, GameVars.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_FLIER:
                            enemy = new Enemy(GameConstants.ENEMY_FLIER, GameVars.ticksCounter, this.engine);
                            break;
                        default: 
                    }

                    // cada ronda que pasa los enemigos tienen mas vida
                    let extraLife = Math.round(enemy.life * (GameVars.round / 10));

                    enemy.life += extraLife;
                    enemy.maxLife = enemy.life;

                    GameVars.waveEnemies.shift();
                }
            }

            return enemy;
        }
    }
}
