module Anuto {

    export class ProjectileTurret extends Turret {

        private canonShoot: string;

        constructor (p: {r: number, c: number}, engine: Engine) {
            
            super(GameConstants.TURRET_PROJECTILE, p, engine);

            this.canonShoot = "center";

            switch (this.grade) {

                case 2:
                case 3:
                    this.canonShoot = "left";
                default:
            }

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

        // estos valores estan sacados del anuto
        protected calculateTurretParameters(): void {

            switch (this.grade) {

                case 1:

                    this.damage = Math.round( (1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 66);
                    this.reload = Math.round((-.05 * this.level + 1.05) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 2.45) * 100) / 100;
                    this.priceImprovement =  Math.round(1 * Math.pow(this.level, 2) + 7 * this.level + 42);
                    this.priceUpgrade = 5600;
            
                    break;

                case 2:

                    this.damage = Math.round( (13 / 3) * Math.pow(this.level, 3) + 6 * Math.pow(this.level, 2) + (335 / 3) * this.level + 3278);
                    this.reload = Math.round((-.05 * this.level + .6) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement =  Math.round( (31 / 6) * Math.pow(this.level, 3) + (13 / 2) * Math.pow(this.level, 2) + (397 / 3) * this.level + 326);
                    this.priceUpgrade = 88500;
          
                    break;

                case 3: 

                    this.damage = Math.round( 50 * Math.pow(this.level, 2) - 50 * this.level + 20000);
                    this.reload = Math.round((-.01 * this.level + .21) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 3.45) * 100) / 100;
                    this.priceImprovement =  Math.round( (46 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (785 / 3) * this.level + 471);
            
                    break;

                default:
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
        
            const d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) +  (this.y - enemy.y) * (this.y - enemy.y)));

            // cuantos ticks va a tardar la bala en llegar?
            const ticksToImpact = Math.floor(MathUtils.fixNumber(d / GameConstants.BULLET_SPEED));

            // encontrar la posicion del enemigo dentro de estos ticks
            const impactPosition = enemy.getNextPosition(ticksToImpact);

            // la posicion de impacto sigue estando dentro del radio de accion?
            const dx = impactPosition.x - this.x;
            const dy = impactPosition.y - this.y;

            const impactSquareDistance = MathUtils.fixNumber(dx * dx + dy * dy);

            switch (this.grade) {

                case 2:
                case 3:
                    if (this.canonShoot === "left") {
                        this.canonShoot = "right";
                    } else {
                        this.canonShoot = "left";
                    }
                default:
            }

            if (this.range * this.range > impactSquareDistance) {

                this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));
                const bullet = new Bullet({c: this.position.c, r: this.position.r}, this.shootAngle, enemy, this.damage, this.canonShoot, this, this.engine);

                this.engine.addBullet(bullet, this);

            } else {
                // no se dispara y se vuelve a estar disponible para disparar
                this.readyToShoot = true;
            }
        }
    }
}
