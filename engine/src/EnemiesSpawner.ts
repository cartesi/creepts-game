// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { Engine } from "./Engine";
import { GameConstants } from "./GameConstants";
import { Enemy } from "./enemies/Enemy";
import { HealerEnemy } from "./enemies/HealerEnemy";

    export class EnemiesSpawner {

        private engine: Engine;

        constructor (engine: Engine) {
            
            this.engine = engine;
        }

        public getEnemy(): Enemy {

            let enemy: Enemy = null;

            if (this.engine.waveEnemies.length > 0) {

                let nextEnemyData = this.engine.waveEnemies[0];
                
                if (nextEnemyData.t === this.engine.ticksCounter) {

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

                    enemy.life = Math.round(enemy.life * this.engine.enemyHealthModifier);
                    enemy.maxLife = enemy.life;
                    enemy.value = Math.round(enemy.value * this.engine.enemyRewardModifier);

                    this.engine.waveEnemies.shift();
                }
            }

            return enemy;
        }
    }
