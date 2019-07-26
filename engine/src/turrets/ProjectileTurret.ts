module Anuto {

    export class ProjectileTurret extends Turret {

        constructor (p: {r: number, c: number}, creationTick: number) {
            
            super(GameConstants.TURRET_PROJECTILE, p, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
