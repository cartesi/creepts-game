module Anuto {

    export class HealerEnemy extends Enemy {

        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_HEALER, creationTick);
        }
    }
}
