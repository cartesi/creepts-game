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

            this.justShot = false;

            const enemyData = this.getEnemiesWithinRange();

            if (enemyData.length > 0) {

                // TODO: ahora pillamos al primero
                this.enemyWithinRange = enemyData[0].enemy;

                // a que distancia esta?
                const d = MathUtils.fixNumber(Math.sqrt(enemyData[0].squareDist));

                // cuantos ticks va a tardar la bala en llegar?
                const ticksToImpact = Math.floor(MathUtils.fixNumber(d / GameConstants.BULLET_SPEED));

                // encontrar la posicion de la torre dentro de estos ticks
                const impactPosition = this.enemyWithinRange.getNextPosition(ticksToImpact);

                // la posicion de impacto sigue estando dentro del radio de accion?
                const dx = impactPosition.x - this.x;
                const dy = impactPosition.y - this.y;

                const impactSquareDistance = MathUtils.fixNumber(dx * dx + dy * dy);

                if (this.range * this.range > impactSquareDistance) {

                    const angle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                    const bullet = new Bullet(this.position, angle, enemyData[0].enemy, this.damage);

                    Engine.currentInstance.addBullet(bullet, this);

                    this.justShot = true;

                } else {
                    this.enemyWithinRange = null;
                }

            } else {
                this.enemyWithinRange = null;
            }
        }
    }
}
