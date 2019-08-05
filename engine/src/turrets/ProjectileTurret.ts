module Anuto {
    // usando esto:
    // https://www.symbolab.com/solver/system-of-equations-calculator/
   
    // damage se calcula en funcion de level mediante una equacion de tercer grado
    // damage = a * level ^ 3 + b * level ^ 2 + c * level + d
    // siendo a = 1 / 3, b = 2, c = 95/3 y d = 66

    // reload = (-1/18) * level + 19/18
    // range = 2/45 * level + 221 / 90
    // priceNextImprovement =  29 / 336 * level ^ 3  + 27 / 56 * level ^ 2 + 2671 / 336 * this.level + 2323 / 56

    export class ProjectileTurret extends Turret {

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_PROJECTILE, p);

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

            this.damage = Math.floor( 1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
            this.reload = Math.round(((-1 / 18) * this.level + 19 / 18 ) * 10) / 10;
            this.range =  Math.round((2 / 45 * this.level + 221 / 90) * 10) / 10;
            this.priceImprovement =  Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            
            // esto hay que calcularlo tambien
            this.priceUpgrade = 5600 * this.grade;

            if (this.level === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcular value con la formuula correspondiente
                // this.value = ????????;
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

            if (this.range * this.range > impactSquareDistance) {

                this.shootAngle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                const bullet = new Bullet(this.position, this.shootAngle, enemy, this.damage);

                Engine.currentInstance.addBullet(bullet, this);

            } else {
                // no se dispara y se vuelve a estar disponible para disparar
                this.readyToShoot = true;
            }
        }
    }
}
