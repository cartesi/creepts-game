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

        private l: number;

        constructor (type: string, creationTick: number) {
            
            this.id = Enemy.id;
            Enemy.id ++;

            this.type = type;
            this.life = GameVars.enemyData.enemies[this.type].life;
            this.speed = GameVars.enemyData.enemies[this.type].speed;

            this.creationTick = creationTick;

            this.l = 0;

            const p = Engine.getPathPosition(this.l);

            this.x = p.x;
            this.y = p.y; 

            this.boundingRadius = .35; // en proporcion al tamaño de las celdas
        }

        public destroy(): void {
            // de momento nada
        }

        public update(): void {

            this.l = MathUtils.fixNumber(this.l + this.speed);

            if (this.l >= GameVars.enemiesPathCells.length - 1) {

                this.x = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].c;
                this.y = GameVars.enemiesPathCells[GameVars.enemiesPathCells.length - 1].r;

                Engine.currentInstance.onEnemyReachedExit(this);

            } else {

                const p = Engine.getPathPosition(this.l);

                this.x = p.x;
                this.y = p.y;
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
