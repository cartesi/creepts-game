module Anuto {

    export class LaunchTurret extends Turret {

        constructor (p: {r: number, c: number}, creationTick: number) {
            
            super(GameConstants.TURRET_LAUNCH, p, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
