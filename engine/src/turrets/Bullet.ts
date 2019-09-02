module Anuto {

    export class Bullet {

        public id: number;
        public x: number;
        public y: number;
        public assignedEnemy: Enemy;
        public damage: number;
        public canonShoot: string;
        public turret: ProjectileTurret;

        private vx: number;
        private vy: number;

        // bullet speed in cells / tick
        constructor (p: {r: number, c: number}, angle: number, assignedEnemy: Enemy, damage: number, canonShoot: string, turret: ProjectileTurret, engine: Engine) {
            
            this.id = engine.bulletId;
            engine.bulletId ++;

            this.x = p.c + .5;
            this.y = p.r + .5;
            
            this.assignedEnemy = assignedEnemy;

            this.damage = damage;
            this.canonShoot = canonShoot;

            this.turret = turret;

            this.vx = MathUtils.fixNumber(GameConstants.BULLET_SPEED * Math.cos(angle));
            this.vy = MathUtils.fixNumber( GameConstants.BULLET_SPEED * Math.sin(angle));
        }

        public destroy(): void {
            //
        }

        public update(): void {
            
            this.x = MathUtils.fixNumber(this.x + this.vx);
            this.y = MathUtils.fixNumber(this.y + this.vy);
        }

        public getPositionNextTick(): {x: number, y: number} {

            return {x: MathUtils.fixNumber(this.x + this.vx), y: MathUtils.fixNumber(this.y + this.vy)};
        }
    }
}