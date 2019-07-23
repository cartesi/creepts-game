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

        public boundingRadius: number;

        constructor (type: string, creationTick: number) {
            
            this.id = Enemy.id;
            Enemy.id ++;

            this.type = type;
            this.life = GameVars.enemyData.enemies[this.type].life;
            this.speed = GameVars.enemyData.enemies[this.type].speed;

            this.creationTick = creationTick;

            this.x = GameVars.enemiesPathCells[0].c + .5;
            this.y = GameVars.enemiesPathCells[0].r + .5; 

            this.boundingRadius = .35; // en proporcion al tamaño de las celdas
        }

        public destroy(): void {
            // de momento nada
        }

        public update(): void {

            // TODO: fijar a 5 decimales

            this.y += this.speed;

            if (this.y > GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].r + .5) {
                Engine.currentInstance.onEnemyReachedExit(this);
            }
        }

        public hit(damage: number): void {
            
            this.life -= damage;

            if (this.life <= 0) {
                Engine.currentInstance.onEnemyKilled(this);
            }
        }

        public getNextPosition(ticks: number): {x: number, y: number} {

            const x = this.x;
            const y = this.y + this.speed * ticks;

            return{x: x, y: y};
        }
    }
}
