module Anuto {

    export class RunnerEnemy extends Enemy {

        constructor (creationTick: number) {
            
            super(GameConstants.ENEMY_RUNNER, creationTick);

            console.log("runner instanciado");
        }

        public update(): void {

            super.update();
        }
    }
}
