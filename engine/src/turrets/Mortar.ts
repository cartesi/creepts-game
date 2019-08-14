module Anuto {

    export class Mortar {

        public static id: number;

        public id: number;
        public x: number;
        public y: number;
        public ticksToImpact: number;
        public detonate: boolean;
        public explosionRange: number;
        public creationTick: number;
        public grade: number;
        public turret: LaunchTurret;

        private vx: number;
        private vy: number;
        private f: number;
        private damage: number;
        
        // mortar speed in cells / tick
        constructor (p: {r: number, c: number}, angle: number, ticksToImpact: number, explosionRange: number, damage: number, grade: number, turret: LaunchTurret) {
            
            this.id = Mortar.id;
            Mortar.id ++;

            this.creationTick = GameVars.ticksCounter;

            this.x = p.c + .5;
            this.y = p.r + .5;

            this.ticksToImpact = ticksToImpact;
            this.explosionRange = explosionRange;
            this.damage = damage;
            this.grade = grade;
            this.turret = turret;

            this.detonate = false;
            this.f = 0;

            let speed = this.grade === 3 ? GameConstants.MORTAR_SPEED * 5 : GameConstants.MORTAR_SPEED;

            this.vx = MathUtils.fixNumber(speed * Math.cos(angle));
            this.vy = MathUtils.fixNumber(speed * Math.sin(angle));
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

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const enemy = GameVars.enemies[i];
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
