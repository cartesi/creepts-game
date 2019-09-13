module Anuto {

    export class Enemy {

        public type: string;
        public id: number;
        public life: number;
        public maxLife: number;
        public speed: number;
        public x: number;
        public y: number;
        public prevX: number;
        public prevY: number;
        public creationTick: number;
        public value: number;
        public boundingRadius: number;
        public l: number;
        public affectedByGlue: boolean;
        public glueIntensity: number;
        public affectedByGlueBullet: boolean;
        public glueBulletIntensity: number;
        public glueBulletDurationTicks: number;
        public hasBeenTeleported: boolean;
        public teleporting: boolean;

        public modifiers: {[key: string]: string};
        
        protected enemyData: any;
        protected t: number;
        protected engine: Engine;
        protected glueTicksCounter: number;

        constructor (type: string, creationTick: number, engine: Engine) {
            
            this.id = engine.enemyId;
            engine.enemyId ++;

            this.modifiers = {};

            this.creationTick = creationTick;
            this.engine = engine;

            this.type = type;
            this.enemyData = this.engine.enemyData[this.type];

            this.life =  this.enemyData.life;
            this.maxLife = this.enemyData.life;
            this.value = this.enemyData.value;
            this.speed = this.enemyData.speed;

            this.affectedByGlue = false;
            this.glueIntensity = 0;
            this.affectedByGlueBullet = false;
            this.glueBulletIntensity = 0;
            this.glueBulletDurationTicks = 0;
            this.glueTicksCounter = 0;
            this.hasBeenTeleported = false;
            this.teleporting = false;

            this.l = 0;
            this.t = 0;

            const p = this.engine.getPathPosition(this.l);

            this.x = p.x;
            this.y = p.y; 
            this.prevX = this.x;
            this.prevY = this.y;

            this.boundingRadius = this.type === GameConstants.ENEMY_RUNNER ? .5 : .475;

            switch (this.type) {
                case GameConstants.ENEMY_HEALER:
                    this.modifiers[GameConstants.TURRET_LASER] = "weak";
                    this.modifiers[GameConstants.TURRET_PROJECTILE] = "weak";
                    break;
                case GameConstants.ENEMY_FLIER:
                    this.modifiers[GameConstants.TURRET_LASER] = "weak";
                    this.modifiers[GameConstants.TURRET_PROJECTILE] = "weak";
                    break;
                case GameConstants.ENEMY_RUNNER:
                    this.modifiers[GameConstants.TURRET_LAUNCH] = "weak";
                    this.modifiers[GameConstants.TURRET_LASER] = "strong";
                    break;
                case GameConstants.ENEMY_BLOB:
                    this.modifiers[GameConstants.TURRET_LAUNCH] = "weak";
                    this.modifiers[GameConstants.TURRET_PROJECTILE] = "strong";
                    break;
                default:
                    break;
            }
        }

        public destroy(): void {
            // de momento nada
        }

        public update(): void {

            if (this.teleporting) {

                this.t ++;

                if (this.t === 8) {
                    this.teleporting = false;
                }
                return;
            }

            let speed = this.speed;

            // si esta encima de pegamento hacer que vaya mas lento
            if (this.affectedByGlue) {

                speed = MathUtils.fixNumber(this.speed / this.glueIntensity);   
            }

            if (this.affectedByGlueBullet) {

                speed = MathUtils.fixNumber(this.speed / this.glueBulletIntensity);

                this.glueTicksCounter++;

                if (this.glueTicksCounter === this.glueBulletDurationTicks) {
                    this.affectedByGlueBullet = false;
                } 
            }
           
            this.l = MathUtils.fixNumber(this.l + speed);

            this.prevX = this.x;
            this.prevY = this.y;

            if (this.l >= this.engine.enemiesPathCells.length - 1) {

                this.x = this.engine.enemiesPathCells[this.engine.enemiesPathCells.length - 1].c;
                this.y = this.engine.enemiesPathCells[this.engine.enemiesPathCells.length - 1].r;

                this.engine.onEnemyReachedExit(this);

            } else {

                const p = this.engine.getPathPosition(this.l);

                this.x = p.x;
                this.y = p.y;
            }
        }

        public teleport(teleportDistance: number): void {

            this.hasBeenTeleported = true;
            this.teleporting = true;
            this.t = 0;

            this.l -= teleportDistance;

            if (this.l < 0) {
                this.l = 0;
            }

            const p = this.engine.getPathPosition(this.l);

            this.x = p.x;
            this.y = p.y;
        }

        public hitByGlueBullet(glueBulletIntensity: number, glueBulletsDurationTicks: number): void {
            
            this.glueTicksCounter = 0;
            this.affectedByGlueBullet = true;
            this.glueBulletIntensity = glueBulletIntensity;
            this.glueBulletDurationTicks = glueBulletsDurationTicks;
        }

        public glue(glueIntensity: number): void{

            this.affectedByGlue = true;
            this.glueIntensity = glueIntensity;
        }

        public hit(damage: number, bullet?: Bullet, mortar?: Mortar, mine?: Mine, laserTurret?: LaserTurret): void {
            
            if (this.life <= 0) {
                return;
            }

            let modifier = 1;

            if (bullet) {
                if (this.modifiers[GameConstants.TURRET_PROJECTILE] === "weak") {
                    modifier = GameConstants.WEAK_AGAINST_DAMAGE_MODIFIER;
                } else if (this.modifiers[GameConstants.TURRET_PROJECTILE] === "strong") {
                    modifier = GameConstants.STRONG_AGAINST_DAMAGE_MODIFIER;
                }
            } else if (mortar || mine) {
                if (this.modifiers[GameConstants.TURRET_LAUNCH] === "weak") {
                    modifier = GameConstants.WEAK_AGAINST_DAMAGE_MODIFIER;
                } else if (this.modifiers[GameConstants.TURRET_LAUNCH] === "strong") {
                    modifier = GameConstants.STRONG_AGAINST_DAMAGE_MODIFIER;
                }
            } else if (laserTurret) {
                if (this.modifiers[GameConstants.TURRET_LASER] === "weak") {
                    modifier = GameConstants.WEAK_AGAINST_DAMAGE_MODIFIER;
                } else if (this.modifiers[GameConstants.TURRET_LASER] === "strong") {
                    modifier = GameConstants.STRONG_AGAINST_DAMAGE_MODIFIER;
                }
            }
            
            this.life -= MathUtils.fixNumber(damage * modifier);

            if (bullet && bullet.turret) {
                // console.log("BULLET " + bullet.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                bullet.turret.inflicted += Math.round(damage);
            } else if (mortar && mortar.turret) {
                // console.log("MORTAR " + mortar.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                mortar.turret.inflicted += Math.round(damage);
            } else if (mine && mine.turret) {
                // console.log("MINE " + mine.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                mine.turret.inflicted += Math.round(damage);
            } else if (laserTurret) {
                // console.log("LASER " + laserTurret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                laserTurret.inflicted += Math.round(damage);
            }

            if (this.life <= 0) {
                this.life = 0;
                this.engine.onEnemyKilled(this);
            }
        }

        public restoreHealth(): void {

            this.life += MathUtils.fixNumber(this.maxLife / 20);

            if (this.life > this.maxLife) {
                this.life = this.maxLife;
            }
        }

        public getNextPosition(deltaTicks: number): {x: number, y: number} {

            let speed = this.speed;

            if (this.affectedByGlue) {
                speed = MathUtils.fixNumber(this.speed / this.glueIntensity);
            }

            let l = MathUtils.fixNumber(this.l + speed * deltaTicks);

            const p = this.engine.getPathPosition(l);

            if (!p) {
                return null;
            }

            return {x: p.x, y: p.y};
        }
    }
}
