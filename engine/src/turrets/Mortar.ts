module Anuto {

    export class Mortar {

        public static id: number;

        public id: number;
        public x: number;
        public y: number;
        public ticksToImpact: number;
        public detonate: boolean;

        private vx: number;
        private vy: number;
        private f: number;
        private damage: number;
        private explosionRange: number;

        // mortar speed in cells / tick
        constructor (p: {r: number, c: number}, angle: number, ticksToImpact: number, explosionRange: number, damage: number) {
            
            this.id = Mortar.id;
            Mortar.id ++;

            this.x = p.c + .5;
            this.y = p.r + .5;

            this.ticksToImpact = ticksToImpact;
            this.explosionRange = explosionRange;
            this.damage = damage;

            this.detonate = false;
            this.f = 0;

            this.vx = MathUtils.fixNumber(GameConstants.MORTAR_SPEED * Math.cos(angle));
            this.vy = MathUtils.fixNumber( GameConstants.MORTAR_SPEED * Math.sin(angle));
        }

        public destroy(): void {
            //
        }

        public update(): void {
            
            this.x = MathUtils.fixNumber(this.x + this.vx);
            this.y = MathUtils.fixNumber(this.y + this.vy);

            this.f ++;

            if (this.f === this.ticksToImpact) {
                this.detonate = true;
            }
        }

        public getEnemiesWithinExplosionRange(): {enemy: Enemy, damage: number} [] {

            const hitEnemiesData: {enemy: Enemy, damage: number} [] = [];
            
            return hitEnemiesData;
        }
    }
}
