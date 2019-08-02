module Anuto {

    export class HealerEnemy extends Enemy {

        public healing: boolean;

        private f: number;
    
        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_HEALER, creationTick);

            // para que no se paren todos en el mismo lugar y al mismo tiempo
            this.f = GameConstants.HEALER_HEALING_TICKS - creationTick % GameConstants.HEALER_HEALING_TICKS;

            this.healing = false;
        }

        public update(glues: Glue[]): void {

            this.f ++;

            if (this.healing) {

                this.heal();

                if (this.f === GameConstants.HEALER_STOP_TICKS) {
                    this.f = 0;
                    this.healing = false;
                }

            } else {

                super.update(glues);

                // no cura si ya esta muy cerca de la salida
                if (this.f === GameConstants.HEALER_HEALING_TICKS && this.l < GameVars.enemiesPathCells.length - 2) {
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
                    if (distanceSquare <= GameConstants.HEALER_HEALING_RADIUS * GameConstants.HEALER_HEALING_RADIUS) {
                        enemy.restoreHealth();
                    }
                }
            }
        }
    }
}
