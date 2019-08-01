module Anuto {

    export class GlueTurret extends Turret {

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_GLUE, p);
        }

        public update(): void {

            super.update();
        }
    }
}
