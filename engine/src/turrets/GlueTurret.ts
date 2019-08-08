module Anuto {

    export class GlueTurret extends Turret {

        public intensity: number;
        public teleportDistance: number;

        public duration: number;
        public durationTicks: number;

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_GLUE, p);

            this.maxLevel = 5;

            this.calculateTurretParameters();
        }

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {
    
            switch (this.grade) {

                case 1:

                    this.damage = Math.floor( 1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
                    this.reload = 5;
                    this.range =  Math.round((2 / 45 * this.level + 12 / 9) * 10) / 10;
                    this.duration = 3;
                    this.durationTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.duration);
                    this.intensity = 2;
                    this.priceImprovement = Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            
                    break;

                case 2:

                    this.damage = Math.floor( 1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
                    this.reload = 5;
                    this.range =  Math.round((2 / 45 * this.level + 12 / 9) * 10) / 10;
                    this.duration = 3;
                    this.durationTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.duration);
                    this.intensity = 2;
                    this.priceImprovement = Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
                
                    break;

                case 3: 

                    this.teleportDistance = 5; // en el juego ANUTO son 15
                    this.reload = 5;
                    this.range =  Math.round((4 / 45 * this.level + 24 / 9) * 10) / 10;
                    this.priceImprovement = Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            
                    break;

                default:
            }
                       
            // esto hay que calcularlo tambien
            this.priceUpgrade = 800 * this.grade;

            if (this.level === 1 && this.grade === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcularlo
            }

            super.calculateTurretParameters();
        }

        protected shoot(): void {
            
            super.shoot();

            let enemy: Enemy;

            switch (this.grade) {
                case 1:
                    const glue = new Glue(this.position, this.intensity, this.durationTicks, this.range);
                    Engine.currentInstance.addGlue(glue, this);
                    break;
                case 2:

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
        
                        this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));
                        const bullet = new GlueBullet({c: this.position.c, r: this.position.r}, this.shootAngle, enemy, this.intensity, this.durationTicks);
        
                        Engine.currentInstance.addGlueBullet(bullet, this);
        
                    } else {
                        // no se dispara y se vuelve a estar disponible para disparar
                        this.readyToShoot = true;
                    }
                    break;
                case 3:

                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    } else {
                        enemy = this.enemiesWithinRange[0];
                    }
                    
                    if (enemy.life > 0 && !enemy.hasBeenTeleported) { 
                        Engine.currentInstance.flagEnemyToTeleport(enemy, this);
                    } else {
                        this.readyToShoot = true;
                    }

                    break;
                default:
            }
        }
    }
}
