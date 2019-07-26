module Anuto {

    export class LaserTurret extends Turret {

        constructor (p: {r: number, c: number}, creationTick: number) {
            
            super(GameConstants.TURRET_LASER, p, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
