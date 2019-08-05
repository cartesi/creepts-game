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
            
            if (this.level === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcularlo
            }

            super.calculateTurretParameters();
        }  

        protected shoot(): void {

            super.shoot();

            let enemy: Enemy;

            if (this.fixedTarget) {
                enemy = this.followedEnemy || this.enemiesWithinRange[0];
            } else {
                enemy = this.enemiesWithinRange[0];
            }
            
            if (enemy.life > 0) { 
                // if (this.id === 3) {
                //     console.log("rayo disparado:", GameVars.ticksCounter);
                // }
                Engine.currentInstance.addLaserRay(this, enemy);
            } else {
                this.readyToShoot = true;
            }
        }
    }
}
