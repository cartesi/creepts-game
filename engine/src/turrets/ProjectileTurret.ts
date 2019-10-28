import { GameConstants } from "../GameConstants";
import { MathUtils } from "../utils/MathUtils";
import { Engine } from "../Engine";
import { Enemy } from "../enemies/Enemy";
import { Bullet } from "./Bullet";
import { Turret } from "./Turret";

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

            this.projectileSpeed = GameConstants.BULLET_SPEED;

            this.calculateTurretParameters();
        }

        // estos valores estan sacados del anuto
        protected calculateTurretParameters(): void {

            let turretDataAtributes = this.engine.turretData[this.type].attributes[this.grade - 1];

            this.damage = turretDataAtributes.damage[this.level - 1];
            this.reload = turretDataAtributes.reload[this.level - 1];
            this.range = turretDataAtributes.range[this.level - 1];
            this.priceImprovement = turretDataAtributes.priceImprovement[this.level - 1];
            
            if (this.grade < 3) {
                this.priceUpgrade = turretDataAtributes.priceUpgrade;
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
        
            const d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));

            // cuantos ticks va a tardar la bala en llegar?
            const ticksToImpact = Math.floor(MathUtils.fixNumber(d / this.projectileSpeed));

            const impactPosition = enemy.getNextPosition(ticksToImpact);

            const dx = impactPosition.x - this.x;
            const dy = impactPosition.y - this.y;

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

            this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));
            const bullet = new Bullet({c: this.position.c, r: this.position.r}, this.shootAngle, enemy, this.damage, this.canonShoot, this, this.engine);

            this.engine.addBullet(bullet, this);
        }
    }
