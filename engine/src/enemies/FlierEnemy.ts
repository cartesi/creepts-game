module Anuto {

    export class FlierEnemy extends Enemy {

        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_FLIER, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
