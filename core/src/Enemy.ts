module Anuto {

    export class Enemy {

        public type: string;
        public id: number;
        public life: number;
        public speed: number;
        public x: number;
        public y: number;
        public creationTick: number;

        constructor (type: string, creationTick: number) {
            
            this.type = type;
            this.life = GameVars.enemyData.enemies[this.type].life;
            this.speed = GameVars.enemyData.enemies[this.type].speed;

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
