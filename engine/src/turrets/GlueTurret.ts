module Anuto {

    export class GlueTurret extends Turret {

        constructor (p: {r: number, c: number}, creationTick: number) {
            
            super(GameConstants.TURRET_GLUE, p, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
