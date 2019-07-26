module Anuto {

    export class Turret {

        public static id: number;

        public id: number;
        public type: string;
        public level: number;
        public damage: number;
        public reload: number;
        public range: number;
        public value: number;
        public position: {r: number, c: number};
        public x: number;
        public y: number;
        public creationTick: number;
        public enemyWithinRange: Enemy;

        protected f: number;
        protected reloadTicks: number;
        protected readyToShoot: boolean;
        protected justShot: boolean;

        constructor (type: string, p: {r: number, c: number}, creationTick: number) {

            this.id = Turret.id;
            Turret.id ++;

            this.type = type;
            this.f = 0;
            this.level = 1;
            this.readyToShoot = false;
            this.justShot = false;

            this.position = p;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;

            this.damage = GameVars.turretData[type].damage;
            this.range = GameVars.turretData[type].range;
            this.reload = GameVars.turretData[type].reload;

            this.creationTick = creationTick;

            this.reloadTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.reload);

            // sacar el resto de valores                                                                                                    
            this.value = 0;
        }

        public destroy(): void {
            //
        }

        public update(): void {

            if (this.readyToShoot) {

                this.shoot();

                if (this.justShot) {
                    this.readyToShoot = false;
                }

            } else {

                this.f ++;

                if (this.f === this.reloadTicks) {
                    this.readyToShoot = true;
                    this.f = 0;
                }
            }
        }

        public upgrade(): void {
            
            this.level ++;
        }

        protected shoot(): void {

            // override
        }

        // TODO: hacer que se puedan pillar varios
        protected getEnemiesWithinRange(): {enemy: Enemy, squareDist: number} []{

            let enemies: {enemy: Enemy, squareDist: number} [] = [];
            let squareDist = 1e10;

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                const dx = this.x - GameVars.enemies[i].x;
                const dy = this.y - GameVars.enemies[i].y;

                squareDist = MathUtils.fixNumber(dx * dx + dy * dy);

                if (this.range * this.range >= squareDist) {
                    enemies.push({enemy: GameVars.enemies[i], squareDist: squareDist});
                }
            }

            return enemies;
        }
    }
}
