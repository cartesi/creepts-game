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
import { Enemy } from "../enemies/Enemy";
import { Turret } from "./Turret";

    export class LaserTurret extends Turret {

        constructor (p: {r: number, c: number}, engine: Engine) {
            
            super(GameConstants.TURRET_LASER, p, engine);

            this.calculateTurretParameters();
        }

        protected calculateTurretParameters(): void {

            let turretDataAtributes = this.engine.turretsAttributes[this.type][this.grade - 1];

            this.damage = turretDataAtributes.damage[this.level - 1];
            this.reload = turretDataAtributes.reload[this.level - 1];
            this.range = turretDataAtributes.range[this.level - 1];
            this.priceImprovement = turretDataAtributes.priceImprovement[this.level - 1];
            
            if (this.grade < 3) {
                this.priceUpgrade = turretDataAtributes.priceUpgrade;
            }

            super.calculateTurretParameters();
        }  

        protected getEnemiesWithinLine(enemy: Enemy): Enemy[] {

            let newEnemies = [];

            for (let i = 0; i < this.engine.enemies.length; i ++) {

                const newEnemy = this.engine.enemies[i];

                let infiniteX = newEnemy.x + (enemy.x - this.x) * 1000;
                let infiniteY = newEnemy.y + (enemy.y - this.y) * 1000;

                if (newEnemy !== enemy && MathUtils.isLineSegmentIntersectingCircle({x: this.x, y: this.y}, {x: infiniteX, y: infiniteY}, {x: newEnemy.x, y: newEnemy.y}, .3)) {
                    newEnemies.push(newEnemy);
                }
            }

            return newEnemies;
        }

        protected shoot(): void {

            super.shoot();

            let enemies: Enemy[] = [];

            let enemiesNumber = 1;
            let enemiesCounter = 0;

            switch (this.grade) {
                case 1:
                    enemiesNumber = 1;
                    break;
                case 2:
                    enemiesNumber = 3;
                    break;
                case 3:
                default:
            }

            if (this.grade === 3) {

                if (this.fixedTarget) {
                    enemies.push(this.followedEnemy || this.enemiesWithinRange[0]);
                } else {
                    enemies.push(this.enemiesWithinRange[0]);
                }

                enemies = enemies.concat(this.getEnemiesWithinLine(enemies[0]));

            } else {
                if (this.fixedTarget) {
                    if (this.followedEnemy) {
                        enemies.push(this.followedEnemy);
                        if (this.followedEnemy === this.enemiesWithinRange[0]) {
                            enemiesCounter++;
                        }
                    } else {
                        enemies.push(this.enemiesWithinRange[0]);
                        enemiesCounter++;
                    }
                } else {
                    enemies.push(this.enemiesWithinRange[0]);
                    enemiesCounter++;
                }
    
                while (enemies.length < enemiesNumber) {
    
                    if (this.enemiesWithinRange[enemiesCounter] ) {
                        enemies.push(this.enemiesWithinRange[enemiesCounter]);
                        enemiesCounter++;
                    } else {
                        break;
                    }
                }
            }
            
            if (enemies[0].life > 0) {
                this.engine.addLaserRay(this, enemies);
            } else {
                this.readyToShoot = true;
            }
        }
    }
