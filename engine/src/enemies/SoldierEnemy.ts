module Anuto {

    export class SoldierEnemy extends Enemy {

        constructor (creationTick: number) {

            super(GameConstants.ENEMY_SOLDIER, creationTick);

            console.log("soldier instanciado");
        }

        public update(): void {

            super.update();
        }
    }
}
