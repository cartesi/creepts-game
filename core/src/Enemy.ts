namespace Anuto {

    export class Enemy {

        public id: number;
        public life: number;
        public speed: number;
        public x: number;
        public y: number;
        public creationTick: number;

        constructor (id: number, creationTick: number) {
            
            this.id = id;
            this.life = 100;
            this.speed = .1;
            this.creationTick = creationTick;

            this.x = 0;
            this.y = 0;
        }

        public destroy(): void {
            //
        }

        public update(): void {

            this.y += this.speed;
        }

        public hit(damage: number): void {
            
            this.life -= damage;

            if (this.life <= 0) {
                this.destroy();
            }
        }
    }
}
