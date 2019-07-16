module Anuto {

    export class Enemy {

        public type: number;
        public life: number;
        public speed: number;

        constructor () {
            //
        }

        public destroy(): void {
            //
        }

        public update(): void {
            //
        }

        public hit(damage: number): void {
            
            this.life -= damage;

            if (this.life <= 0) {
                this.destroy();
            }
        }
    }
}
