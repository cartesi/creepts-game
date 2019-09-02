module Anuto {

    export class Mine {

        public static id: number;

        public id: number;
        public x: number;
        public y: number;
        public explosionRange: number;
        public range: number;
        public damage: number;
        public detonate: boolean;
        public turret: LaunchTurret;

        private engine: Engine;

        constructor (p: {r: number, c: number}, explosionRange: number, damage: number, turret: LaunchTurret, engine: Engine) {
            
            this.id = Mine.id;
            Mine.id ++;

            this.x = p.c + .5;
            this.y = p.r + .5;

            this.explosionRange = explosionRange;
            this.damage = damage;
            this.range = .5;
            this.detonate = false;
            this.engine = engine;

            this.turret = turret;
        }

        public destroy(): void {
            // nada de momento
        }

        public update(): void {
            
            if (!this.detonate) {

                for (let i = 0; i < this.engine.enemies.length; i ++) {

                    const enemy = this.engine.enemies[i];
                    const distance = MathUtils.fixNumber(Math.sqrt((enemy.x - this.x) *  (enemy.x - this.x) + (enemy.y - this.y) *  (enemy.y - this.y)));

                    if (enemy.type === GameConstants.ENEMY_FLIER) {
                        continue;
                    }
    
                    if (distance <= this.range) {
                        this.detonate = true;
                        break;
                    }
                }

            }
        }

        public getEnemiesWithinExplosionRange(): {enemy: Enemy, damage: number} [] {

            const hitEnemiesData: {enemy: Enemy, damage: number} [] = [];

            for (let i = 0; i < this.engine.enemies.length; i ++) {

                const enemy = this.engine.enemies[i];
                const distance = MathUtils.fixNumber(Math.sqrt((enemy.x - this.x) *  (enemy.x - this.x) + (enemy.y - this.y) *  (enemy.y - this.y)));

                if (distance <= this.explosionRange) {

                    const damage = MathUtils.fixNumber(this.damage * (1 - distance / this.explosionRange));
                    hitEnemiesData.push({enemy: enemy, damage: damage});
                }
            }

            return hitEnemiesData;
        }
    }
}
