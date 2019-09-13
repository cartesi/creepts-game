module Anuto {

    export class GlueTurret extends Turret {

        public intensity: number;
        public teleportDistance: number;
        public duration: number;
        public durationTicks: number;

        constructor (p: {r: number, c: number}, engine: Engine) {
            
            super(GameConstants.TURRET_GLUE, p, engine);

            this.maxLevel = 5;
            this.teleportDistance = 0;

            this.projectileSpeed = GameConstants.BULLET_SPEED;

            this.calculateTurretParameters();
        }

        public update(): void {

            // cuando tiene grado 1 no hace falta calcular los enemigos que tenga en el radio de accion
            if (this.grade === 1) {

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

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {
    
            switch (this.grade) {

                case 1:

                    this.intensity = Math.round((.2 * this.level + 1) * 100) / 100;
                    this.duration = 1.5;
                    this.reload = 2;
                    this.range = Math.round((.1 * this.level + 1.4) * 100) / 100;
                    this.priceImprovement = Math.floor( (1 / 6) * Math.pow(this.level, 3) + 1 * Math.pow(this.level, 2) + (95 / 6) * this.level + 83);
                    this.priceUpgrade = 800;
            
                    break;

                case 2:

                    this.intensity = Math.round((.3 * this.level + .9) * 100) / 100;
                    this.duration = 2.5;
                    this.reload = 3;
                    this.range = Math.round((.2 * this.level + 2.3) * 100) / 100;
                    this.priceImprovement = Math.floor( (1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 166);
                    this.priceUpgrade = 1700;
                
                    break;

                case 3: 

                    this.teleportDistance = Math.round((5 * this.level + 10) * 100) / 100;
                    this.reload = Math.round((-.5 * this.level + 5.5) * 100) / 100;
                    this.range = 3.5;
                    this.priceImprovement = Math.floor( (10 / 3) * Math.pow(this.level, 3) + 20 * Math.pow(this.level, 2) + (950 / 3) * this.level + 1660);
            
                    break;

                default:
            }

            this.durationTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.duration);

            super.calculateTurretParameters();
        }

        protected shoot(): void {
            
            super.shoot();

            let enemy: Enemy;

            switch (this.grade) {

                case 1:

                    const glue = new Glue(this.position, this.intensity, this.durationTicks, this.range, this.engine);
                    this.engine.addGlue(glue, this);
                    break;

                case 2:

                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    } else {
                        enemy = this.enemiesWithinRange[0];
                    }
                
                    const d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) +  (this.y - enemy.y) * (this.y - enemy.y)));
        
                    // cuantos ticks va a tardar la bala en llegar?
                    const ticksToImpact = Math.floor(MathUtils.fixNumber(d / this.projectileSpeed));
        
                    // encontrar la posicion del enemigo dentro de estos ticks
                    const impactPosition = enemy.getNextPosition(ticksToImpact);
        
                    // la posicion de impacto sigue estando dentro del radio de accion?
                    const dx = impactPosition.x - this.x;
                    const dy = impactPosition.y - this.y;
        
                    this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));
                    const bullet = new GlueBullet({c: this.position.c, r: this.position.r}, this.shootAngle, enemy, this.intensity, this.durationTicks, this.engine);
    
                    this.engine.addGlueBullet(bullet, this);
        
                    break;

                case 3:

                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    } else {
                        enemy = this.enemiesWithinRange[0];
                    }
                     
                    this.engine.flagEnemyToTeleport(enemy, this);
                
                    break;
                    
                default:
            }
        }
    }
}
