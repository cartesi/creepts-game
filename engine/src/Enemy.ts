module Anuto {

    export class Enemy {

        public static id: number;

        public type: string;
        public id: number;
        public life: number;
        public speed: number;
        public x: number;
        public y: number;
        public creationTick: number;

        constructor (type: string, creationTick: number) {
            
            this.id = Enemy.id;
            Enemy.id ++;

            this.type = type;
            this.life = GameVars.enemyData.enemies[this.type].life;
            this.speed = GameVars.enemyData.enemies[this.type].speed;

            this.creationTick = creationTick;

            this.x = GameVars.enemyStartPosition.c + .5;
            this.y = GameVars.enemyStartPosition.r + .5;
        }

        public destroy(): void {
            // de momento nada
        }

        public update(): void {

            this.y += this.speed;

            if (this.y > GameVars.enemyEndPosition.r + .5) {
                Engine.currentInstance.onEnemyReachedExit(this);
            }
        }

        public hit(damage: number): void {
            
            this.life -= damage;

            if (this.life <= 0) {
                Engine.currentInstance.onEnemyKilled(this);
            }
        }
    }
}
