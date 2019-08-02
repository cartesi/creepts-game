module Anuto {

    export class GlueTurret extends Turret {

        public intensity: number;
        public duration: number;
        public durationTicks: number;

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_GLUE, p);

            this.calculateTurretParameters();
        }

        public update(): void {

            super.update();
        }

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {

            this.damage = Math.floor( 1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
            this.reload = 5;
            this.range =  Math.round((2 / 45 * this.level + 12 / 9) * 10) / 10;

            this.duration = 3;
            this.durationTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.duration);

            this.intensity = 3;
            
            this.priceImprovement =  Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            
            if (this.level === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcularlo
            }

            super.calculateTurretParameters();
        }

        protected shoot(): void {

            super.shoot();

            const glue = new Glue(this.position, this.intensity, this.durationTicks, this.range);

            Engine.currentInstance.addGlue(glue, this);

            console.log("ADD GLUE " + Date.now());
        }
    }
}
