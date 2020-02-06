// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { GameConstants } from "../GameConstants";
import { MathUtils } from "../utils/MathUtils";
import { Engine } from "../Engine";
import { Enemy } from "./Enemy";

    export class HealerEnemy extends Enemy {

        public healing: boolean;

        private f: number;
    
        constructor (creationTick: number, engine: Engine) {
            
            super(GameConstants.ENEMY_HEALER, creationTick, engine);

            this.f = GameConstants.HEALER_HEALING_TICKS - creationTick % GameConstants.HEALER_HEALING_TICKS;

            this.healing = false;
        }

        public update(): void {

            this.f ++;

            if (this.healing) {

                this.heal();

                if (this.f >= GameConstants.HEALER_STOP_TICKS) {
                    this.f = 0;
                    this.healing = false;
                }

            } else {

                super.update();

                if (this.f >= GameConstants.HEALER_HEALING_TICKS && this.l < this.engine.enemiesPathCells.length - 2) {
                    this.f = 0;
                    this.healing = true;
                }
            }
        }

        private heal(): void {

            for (let i = 0; i < this.engine.enemies.length; i ++) {

                const enemy = this.engine.enemies[i];

                if (enemy.id === this.id) {
                    enemy.restoreHealth();
                } else {
                    const distanceSquare = MathUtils.fixNumber((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y));
                    if (distanceSquare <= GameConstants.HEALER_HEALING_RADIUS * GameConstants.HEALER_HEALING_RADIUS) {
                        enemy.restoreHealth();
                    }
                }
            }
        }
    }
