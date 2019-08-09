module Anuto {

    export class LaserTurret extends Turret {

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_LASER, p);

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

            this.damage = Math.floor( 271 / 630 * Math.pow(this.level, 3) + 283 / 315 * Math.pow(this.level, 2) + 2437 / 70 * this.level + 1357 / 7);
            this.reload = Math.round((-.1 * this.level + 1.6 ) * 10) / 10;
            this.range =  Math.round((.04 * this.level + 2.96) * 10) / 10;
            this.priceImprovement =  Math.floor( 9 / 80 * Math.pow(this.level, 3) + 17 / 120 * Math.pow(this.level, 2) + 2153 / 240 * this.level + 1631 / 40);
            
            // esto hay que calcularlo tambien
            this.priceUpgrade = 7000 * this.grade;

            if (this.level === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcularlo
            }

            super.calculateTurretParameters();
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

                // TODO: si esta en grado 3 hay que buscar todos los enemigos que pasan a traves de la linea recta del laser
                if (this.fixedTarget) {
                    enemies.push(this.followedEnemy || this.enemiesWithinRange[0]);
                } else {
                    enemies.push(this.enemiesWithinRange[0]);
                }

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
                Engine.currentInstance.addLaserRay(this, enemies);
            } else {
                this.readyToShoot = true;
            }
        }
    }
}
