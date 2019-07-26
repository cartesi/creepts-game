module Anuto {

    export class BlobEnemy extends Enemy {

        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_BLOB, creationTick);
        }

        public update(): void {

            super.update();
        }
    }
}
