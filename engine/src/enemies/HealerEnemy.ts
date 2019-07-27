module Anuto {

    export class HealerEnemy extends Enemy {

        public healing: boolean;

        private f: number;
    
        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_HEALER, creationTick);

            this.f = 0;
            this.healing = false;
        }

        public update(): void {

            this.f ++;

            if (this.healing) {

                this.heal();

                if (this.f  === GameConstants.HEALER_STOP_TICKS) {
                    this.f = 0;
                    this.healing = false;
                }

            } else {

                super.update();

                if (this.f === GameConstants.HEALER_HEALING_TICKS) {
                    this.f = 0;
                    this.healing = true;
                }
            }
        }

        private heal(): void {

            // encontrar a todos los enemigos que esten dentro de un determinado radio y restaurarles la salud
            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const enemy = GameVars.enemies[i];

                if (enemy.id === this.id) {
                    // se cura a si mismo
                    enemy.restoreHealth();
                } else {
                    const distanceSquare = MathUtils.fixNumber((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y));
                    if (distanceSquare < GameConstants.HEALER_HEALING_RADIUS * GameConstants.HEALER_HEALING_RADIUS) {
                        enemy.restoreHealth();
                    }
                }
            }
        }
    }
}
