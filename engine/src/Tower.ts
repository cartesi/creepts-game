module Anuto {

    export class Tower {

        public static id: number;

        public id: number;
        public type: string;
        public level: number;
        public damage: number;
        public reload: number;
        public range: number;
        public value: number;

        public position: {r: number, c: number};
        public x: number;
        public y: number;

        public creationTick: number;
        public enemyWithinRange: Enemy;

        private f: number;
        private reloadTicks: number;

        constructor (type: string, p: {r: number, c: number}, creationTick: number) {

            this.id = Tower.id;
            Tower.id ++;

            this.type = type;
            this.f = 0;
            this.level = 1;

            this.position = p;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;

            this.damage = GameVars.towerData.towers[type].damage;
            this.range = GameVars.towerData.towers[type].range;
            this.reload = GameVars.towerData.towers[type].reload;

            this.creationTick = creationTick;

            this.reloadTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.reload);

            // sacar el resto de valores                                                                                                    
            this.value = 0;
        }

        public destroy(): void {
            //
        }

        public update(): void {
            
            this.f ++;

            if (this.f === this.reloadTicks) {
                this.shoot();
                this.f = 0;
            }
        }

        public upgrade(): void {
            
            this.level ++;
        }

        private shoot(): void {

            const enemyData = this.getEnemyWithinRange();

            if (enemyData.enemy) {

                this.enemyWithinRange = enemyData.enemy;

                // a que distancia esta?
                const d = MathUtils.fixNumber(Math.sqrt(enemyData.squareDist));

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
                    const bullet = new Bullet(this.position, angle);

                    Engine.currentInstance.addBullet(bullet, this);

                } else {
                    this.enemyWithinRange = null;
                }

            } else {
                this.enemyWithinRange = null;
            }
        }

        private getEnemyWithinRange(): {enemy: Enemy, squareDist: number} {

            let enemy: Enemy = null;
            let squareDist = 1e10;

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const dx = this.x - GameVars.enemies[i].x;
                const dy = this.y - GameVars.enemies[i].y;

                squareDist = MathUtils.fixNumber(dx * dx + dy * dy);

                if (this.range * this.range > squareDist) {
                    enemy = GameVars.enemies[i];
                    break;
                }
            }

            return {enemy: enemy, squareDist: squareDist};
        }
    }
}
