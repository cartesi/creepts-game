import { GameConstants } from "../GameConstants";
import { MathUtils } from "../utils/MathUtils";
import { Engine } from "../Engine";
import { Turret } from "./Turret";
import { Enemy } from "../enemies/Enemy";
import { Glue } from "./Glue";
import { GlueBullet } from "./GlueBullet";

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

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {

            let turretDataAtributes = this.engine.turretData[this.type].attributes[this.grade - 1];

            this.reload = turretDataAtributes.reload[this.level - 1];
            this.range = turretDataAtributes.range[this.level - 1];
            this.priceImprovement = turretDataAtributes.priceImprovement[this.level - 1];
            
            if (this.grade < 3) {
                this.priceUpgrade = turretDataAtributes.priceUpgrade;
            }

            if (this.grade === 3) {
                this.teleportDistance = turretDataAtributes.teleportDistance[this.level - 1];
            } else {
                this.intensity = turretDataAtributes.intensity[this.level - 1];
                this.duration = turretDataAtributes.duration[this.level - 1];
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
