module Anuto {

    export class EnemiesSpawner {

        private engine: Engine;

        constructor (engine: Engine) {
            
            this.engine = engine;
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;

            let partialTicks = this.engine.ticksCounter - this.engine.lastWaveTick;
            
            if (partialTicks % this.engine.enemySpawningDeltaTicks === 0 && this.engine.waveEnemies.length > 0) {

                const nextEnemyData = this.engine.waveEnemies[0];
                
                if (nextEnemyData.t === partialTicks / this.engine.enemySpawningDeltaTicks) {

                    switch (nextEnemyData.type) {

                        case GameConstants.ENEMY_SOLDIER:
                            enemy = new Enemy(GameConstants.ENEMY_SOLDIER, this.engine.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_RUNNER:
                            enemy = new Enemy(GameConstants.ENEMY_RUNNER, this.engine.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_HEALER:
                            enemy = new HealerEnemy(this.engine.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_BLOB:
                            enemy = new Enemy(GameConstants.ENEMY_BLOB, this.engine.ticksCounter, this.engine);
                            break;
                        case GameConstants.ENEMY_FLIER:
                            enemy = new Enemy(GameConstants.ENEMY_FLIER, this.engine.ticksCounter, this.engine);
                            break;
                        default: 
                    }

                    // cada ronda que pasa los enemigos tienen mas vida
                    const extraLife = Math.round(enemy.life * (this.engine.round / 10));

                    enemy.life += extraLife;
                    enemy.maxLife = enemy.life;

                    this.engine.waveEnemies.shift();
                }
            }

            return enemy;
        }
    }
}
