module Anuto {

    export class LaserTurret extends Turret {

        constructor (p: {r: number, c: number}, engine: Engine) {
            
            super(GameConstants.TURRET_LASER, p, engine);

            this.calculateTurretParameters();
        }

        public update(): void {

            if (this.fixedTarget) {
                if (this.enemiesWithinRange.length > 0) {
                    if (this.enemiesWithinRange.indexOf(this.followedEnemy) === -1) {
                        this.followedEnemy = this.enemiesWithinRange[0];
                    }   
                } else {
                    this.followedEnemy = null;
                }
            } else {
                this.followedEnemy = this.enemiesWithinRange[0];
            }
            
            super.update();
        }

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {

            switch (this.grade) {

                case 1:

                    this.damage = Math.round( (1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 196);
                    this.reload = Math.round((-.1 * this.level + 1.6) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement =  Math.round(1 * Math.pow(this.level, 2) + 7 * this.level + 42);
                    this.priceUpgrade = 7000;
            
                    break;

                case 2:

                    this.damage = Math.round( (13 / 3) * Math.pow(this.level, 3) + 6 * Math.pow(this.level, 2) + (335 / 3) * this.level + 4178);
                    this.reload = Math.round((-.1 * this.level + 1.6) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement =  Math.round( (37 / 6) * Math.pow(this.level, 3) + (19 / 2) * Math.pow(this.level, 2) + (481 / 3) * this.level + 404);
                    this.priceUpgrade = 96400;
          
                    break;

                case 3: 

                    this.damage = Math.round( (50 / 3) * Math.pow(this.level, 2) - (850 / 3) * this.level + 43700);
                    this.reload = Math.round((-.05 * this.level + 3.05) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 3) * 100) / 100;
                    this.priceImprovement =  Math.round( (39 / 2) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (665 / 3) * this.level + 596);
            
                    break;

                default:
            }

            super.calculateTurretParameters();
        }  

        protected getEnemiesWithinLine(enemy: Enemy): Enemy[] {

            let newEnemies = [];

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const newEnemy = GameVars.enemies[i];

                // if (newEnemy !== enemy && this.inLine({x: this.position.c, y: this.position.r}, {x: Math.floor(newEnemy.x), y: Math.floor(newEnemy.y)}, {x: Math.floor(enemy.x), y: Math.floor(enemy.y)})) {
                //     newEnemies.push(newEnemy);
                // }

                let infiniteX = newEnemy.x + (enemy.x - this.x) * 1000;
                let infiniteY = newEnemy.y + (enemy.y - this.y) * 1000;

                if (newEnemy !== enemy && MathUtils.isLineSegmentIntersectingCircle({x: this.x, y: this.y}, {x: infiniteX, y: infiniteY}, {x: newEnemy.x, y: newEnemy.y}, .3)) {
                    newEnemies.push(newEnemy);
                }
            }

            return newEnemies;

        }

        protected inLine(A: {x: number, y: number}, B: {x: number, y: number}, C: {x: number, y: number}): boolean {

            // if AC is vertical
            if (A.x === C.x) {
                return B.x === C.x;
            }

            // if AC is horizontal
            if (A.y === C.y) {
                return B.y === C.y;
            }
            // match the gradients
            return (A.x - C.x) * (A.y - C.y) === (C.x - B.x) * (C.y - B.y);
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
}
