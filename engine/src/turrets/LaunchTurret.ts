// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { MathUtils } from "../utils/MathUtils";
import { GameConstants } from "../GameConstants";
import { Enemy } from "../enemies/Enemy";
import { Mine } from "../turrets/Mine";
import { Mortar } from "../turrets/Mortar";
import { Turret } from "../turrets/Turret";

    export class LaunchTurret extends Turret {

        public explosionRange: number;
        public numMines: number;

        private minesCounter: number;
      
        constructor (p: {r: number, c: number}, engine) {
            
            super(GameConstants.TURRET_LAUNCH, p, engine);

            this.calculateTurretParameters();

            this.numMines = 0;
            this.minesCounter = 0;
          
            this.projectileSpeed = GameConstants.MORTAR_SPEED;
        }

        public update(): void {

            // cuando tiene grado 2 no hace falta calcular los enemigos que tenga en el radio de accion
            if (this.grade === 2) {

                if (this.readyToShoot) {

                    this.readyToShoot = false;   
                    this.shoot();
            
                } else {
    
                    this.f ++;
    
                    if (this.f >= this.reloadTicks) {
                        this.readyToShoot = true;
                        this.f = 0;
                    }
                }

            } else {

                super.update();
            }
        }

        protected calculateTurretParameters(): void {

            let turretDataAtributes = this.engine.turretsAttributes[this.type][this.grade - 1];

            this.damage = turretDataAtributes.damage[this.level - 1];
            this.explosionRange = turretDataAtributes.explosionRange[this.level - 1];
            this.reload = turretDataAtributes.reload[this.level - 1];
            this.range = turretDataAtributes.range[this.level - 1];
            this.priceImprovement = turretDataAtributes.priceImprovement[this.level - 1];
            this.projectileSpeed = this.grade === 3 ? 2 * GameConstants.MORTAR_SPEED : GameConstants.MORTAR_SPEED;

            if (this.grade < 3) {
                this.priceUpgrade = turretDataAtributes.priceUpgrade;
            }

            super.calculateTurretParameters();
        }

        protected getPathCellsInRange(): {r: number, c: number}[] {

            let cells = [];

            for (let i = 0; i < this.engine.enemiesPathCells.length; i++) {

                let cell = this.engine.enemiesPathCells[i];

                if (cell.c >= this.position.c && cell.c <= this.position.c + this.range ||
                    cell.c <= this.position.c && cell.c >= this.position.c - this.range) {

                        if (cell.r >= this.position.r && cell.r <= this.position.r + this.range ||
                            cell.r <= this.position.r && cell.r >= this.position.r - this.range) {

                                cells.push(cell);
                            }
                    }
            }

            return cells;
        }

        protected shoot(): void {

            if (this.grade === 2) {
                
                let cells: {r: number, c: number}[] = this.getPathCellsInRange();

                if (cells.length > 0 && this.numMines < this.level + 3) {
                    let cell = cells[this.minesCounter % cells.length];
                    this.minesCounter++;
                    this.numMines++;

                    const dx = (cell.c + .5) - this.x;
                    const dy = (cell.r + .5) - this.y;
                    this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));

                    const mine = new Mine({c: cell.c, r: cell.r}, this.explosionRange, this.damage, this, this.engine);
                    this.engine.addMine(mine, this);

                } else {
                    this.readyToShoot = true;
                }

            } else {

                let enemy: Enemy;

                if (this.fixedTarget) {
                    enemy = this.followedEnemy || this.enemiesWithinRange[0];
                } else {
                    enemy = this.enemiesWithinRange[0];
                }

                let ticksToImpact: number;
                let impactPosition: {x: number, y: number};
                let d = this.range;

                let iterations: number;

                if (enemy.type === GameConstants.ENEMY_RUNNER || enemy.type === GameConstants. ENEMY_FLIER) {
                    iterations = 3;
                } else {
                    iterations = 2;
                }

                for (let i = 0; i < iterations; i ++) {
                    ticksToImpact = Math.floor(d / this.projectileSpeed);
                    impactPosition = enemy.getNextPosition(ticksToImpact);
                    d = MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
                }

                const dx = impactPosition.x - this.x;
                const dy = impactPosition.y - this.y;
    
                this.shootAngle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                const mortar = new Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage, this.grade, this, this.engine);
    
                this.engine.addMortar(mortar, this);
            }
        }
    }
