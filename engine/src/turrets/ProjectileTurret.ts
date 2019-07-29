module Anuto {

    export class ProjectileTurret extends Turret {

        constructor (p: {r: number, c: number}, creationTick: number) {
            
            super(GameConstants.TURRET_PROJECTILE, p, creationTick);
        }

        public update(): void {

            super.update();
        }

        protected shoot(): void {

            super.shoot();

            // TODO: HACER AQUI LO DEL FIXED ENEMY

            // let enemy: Enemy;

            // if(this.fixedTarget) {

            // if (!this.followedEnemy) {
            //     // mirar si sigue dentro del los enemigos dentro del radio de accion
            //     if(this.enemiesWithinRange.indexOf(this.followednemy) === -1) {
            //         this.followednemy = this.enemiesWithinRange[0];
            //         enemy = this.followedENemy;
            //     }
            // }
            // } else {
                // enemy = this.enemiesWithinRange[0];
            // }

            const enemy = this.enemiesWithinRange[0];

            const d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) +  (this.y - enemy.y) * (this.y - enemy.y)));

            // cuantos ticks va a tardar la bala en llegar?
            const ticksToImpact = Math.floor(MathUtils.fixNumber(d / GameConstants.BULLET_SPEED));

            // encontrar la posicion de la torre dentro de estos ticks
            const impactPosition = enemy.getNextPosition(ticksToImpact);

            // la posicion de impacto sigue estando dentro del radio de accion?
            const dx = impactPosition.x - this.x;
            const dy = impactPosition.y - this.y;

            const impactSquareDistance = MathUtils.fixNumber(dx * dx + dy * dy);

            if (this.range * this.range > impactSquareDistance) {

                const angle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                const bullet = new Bullet(this.position, angle, enemy, this.damage);

                Engine.currentInstance.addBullet(bullet, this);

            } else {
                // no se dispara y se vuelve a estar disponible para disparar
                this.readyToShoot = true;
            }
        }
    }
}
