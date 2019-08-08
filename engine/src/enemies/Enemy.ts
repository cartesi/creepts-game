module Anuto {

    export class Enemy {

        public static id: number;

        public type: string;
        public id: number;
        public life: number;
        public speed: number;
        public x: number;
        public y: number;
        public creationTick: number;
        public value: number;
        public boundingRadius: number;
        public l: number;
        public affectedByGlue: boolean;
        public glueIntensity: number;
        public affectedByGlueBullet: boolean;
        public glueIntensityBullet: number;
        public glueDuration: number;
        public glueTime: number;
        public hasBeenTeleported: boolean;
        public teleporting: boolean;
        
        protected enemyData: any;
        protected t: number;

        constructor (type: string, creationTick: number) {
            
            this.id = Enemy.id;
            Enemy.id ++;

            this.creationTick = creationTick;

            this.type = type;
            this.enemyData = GameVars.enemyData[this.type];

            this.life =  this.enemyData.life;
            this.value = this.enemyData.value;
            this.speed = this.enemyData.speed;

            this.affectedByGlue = false;
            this.glueIntensity = 0;
            this.affectedByGlueBullet = false;
            this.glueIntensityBullet = 0;
            this.glueDuration = 0;
            this.glueTime = 0;
            this.hasBeenTeleported = false;
            this.teleporting = false;

            this.l = 0;
            this.t = 0;

            const p = Engine.getPathPosition(this.l);

            this.x = p.x;
            this.y = p.y; 

            this.boundingRadius = .4; // en proporcion al tamaño de las celdas
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

                speed = MathUtils.fixNumber(this.speed / this.glueIntensityBullet);

                if (this.glueDuration <= this.glueTime) {
                    this.affectedByGlueBullet = false;
                    this.glueTime = 0;
                } else {
                    this.glueTime++;
                }
            }
           
            this.l = MathUtils.fixNumber(this.l + speed);

            if (this.l >= GameVars.enemiesPathCells.length - 1) {

                this.x = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].c;
                this.y = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].r;

                Engine.currentInstance.onEnemyReachedExit(this);

            } else {

                const p = Engine.getPathPosition(this.l);

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

            const p = Engine.getPathPosition(this.l);

            this.x = p.x;
            this.y = p.y;
        }

        public glue(glueIntensity: number): void{

            this.affectedByGlue = true;
            this.glueIntensity = glueIntensity;
        }

        public hit(damage: number, bullet?: Bullet, mortar?: Mortar, laserTurret?: LaserTurret): void {
            
            this.life -= damage;

            if (this.life <= 0) {

                this.life = 0;
                Engine.currentInstance.onEnemyKilled(this);
            }
        }

        public glueHit(intensity: number, duration: number, bullet: GlueBullet): void {
            
            this.affectedByGlueBullet = true;
            this.glueIntensityBullet = intensity;
            this.glueDuration = duration;
        }

        public restoreHealth(): void {

            this.life = this.enemyData.life;
        }

        public getNextPosition(deltaTicks: number): {x: number, y: number} {

            let speed = this.speed;

            if (this.affectedByGlue) {
                speed = MathUtils.fixNumber(this.speed / this.glueIntensity);
            }

            let l = MathUtils.fixNumber(this.l + speed * deltaTicks);

            const p = Engine.getPathPosition(l);

            return{x: p.x, y: p.y};
        }
    }
}
