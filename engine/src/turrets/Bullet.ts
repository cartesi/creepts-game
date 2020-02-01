// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { MathUtils } from "../utils/MathUtils";
import { Enemy } from "../enemies/Enemy";
import { Engine } from "../Engine";
import { GameConstants } from "../GameConstants";
import { ProjectileTurret } from "../turrets/ProjectileTurret";

    export class Bullet {

        public id: number;
        public x: number;
        public y: number;
        public assignedEnemy: Enemy;
        public damage: number;
        public canonShoot: string;
        public turret: ProjectileTurret;
        public outOfStageBoundaries: boolean;

        private engine: Engine;
        private vx: number;
        private vy: number;

        // bullet speed in cells / tick
        constructor (p: {r: number, c: number}, angle: number, assignedEnemy: Enemy, damage: number, canonShoot: string, turret: ProjectileTurret, engine: Engine) {
            
            this.engine = engine;

            this.id = this.engine.bulletId;
            this.engine.bulletId ++;

            this.x = p.c + .5;
            this.y = p.r + .5;
            
            this.assignedEnemy = assignedEnemy;

            this.outOfStageBoundaries = false;

            this.damage = damage;
            this.canonShoot = canonShoot;

            this.turret = turret;

            this.vx = MathUtils.fixNumber(GameConstants.BULLET_SPEED * Math.cos(angle));
            this.vy = MathUtils.fixNumber( GameConstants.BULLET_SPEED * Math.sin(angle));
        }

        public destroy(): void {
            //
        }

        public update(): void {
            
            this.x = MathUtils.fixNumber(this.x + this.vx);
            this.y = MathUtils.fixNumber(this.y + this.vy);

            // ¿se salio de los limites del tablero?
            if (this.x < -1 || this.x > this.engine.boardSize.c + 1 || this.y < - 1 || this.y >  this.engine.boardSize.r + 1) {
                this.outOfStageBoundaries = true;
            }
        }

        public getPositionNextTick(): {x: number, y: number} {

            return {x: MathUtils.fixNumber(this.x + this.vx), y: MathUtils.fixNumber(this.y + this.vy)};
        }
    }
