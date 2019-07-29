module Anuto {

    export class Turret {

        public static id: number;

        public id: number;
        public creationTick: number;
        public type: string;
        public level: number;
        public x: number;
        public y: number;
        public damage: number;
        public reload: number;
        public range: number;
        public value: number;
        public position: {r: number, c: number};
        public enemyWithinRange: Enemy;
        public shootingStrategy: string;
        public fixedTarget: boolean;

        protected f: number;
        protected reloadTicks: number;
        protected readyToShoot: boolean;
        protected justShot: boolean;
        
        constructor (type: string, p: {r: number, c: number}, creationTick: number) {

            this.id = Turret.id;
            Turret.id ++;

            this.creationTick = creationTick;

            this.type = type;
            this.f = 0;
            this.level = 1;
            this.position = p;
            this.fixedTarget = true;
            this.shootingStrategy = GameConstants.STRATEGY_SHOOT_FIRST;
            this.readyToShoot = false;
            this.justShot = false;

            this.x = this.position.c + .5;
            this.y = this.position.r + .5;

            this.damage = GameVars.turretData[type].damage;
            this.range = GameVars.turretData[type].range;
            this.reload = GameVars.turretData[type].reload;
            this.value =  GameVars.turretData[type].price;

            this.reloadTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.reload);
        }

        public destroy(): void {
            //
        }

        public update(): void {

            if (this.readyToShoot) {

                this.shoot();

                if (this.justShot) {
                    this.justShot = false;
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

            // TODO: actualizar el valor de la torreta
        }

        protected shoot(): void {
            // override
        }

        // TODO: hacer que se puedan pillar varios
        protected getEnemiesWithinRange(): {enemy: Enemy, squareDist: number} []{

            let enemies: {enemy: Enemy, squareDist: number} [] = [];
            let squareDist = 0;

            for (let i = 0; i < GameVars.enemies.length; i ++) {

                if (GameVars.enemies[i].life > 0) {
                    const dx = this.x - GameVars.enemies[i].x;
                    const dy = this.y - GameVars.enemies[i].y;

                    squareDist = MathUtils.fixNumber(dx * dx + dy * dy);

                    if (this.range * this.range >= squareDist) {
                        enemies.push({enemy: GameVars.enemies[i], squareDist: squareDist});
                    }
                }
            }

            if (enemies.length > 1 && (this.type === GameConstants.TURRET_PROJECTILE || this.type === GameConstants.TURRET_LASER)) {
                
                // hacer un sort segun la estrategia
                switch (this.shootingStrategy) {

                    case GameConstants.STRATEGY_SHOOT_LAST:
                        enemies = enemies.sort((e1, e2) => e1.enemy.l - e2.enemy.l);
                        break;
                    case GameConstants.STRATEGY_SHOOT_CLOSEST:
                        enemies = enemies.sort((e1, e2) => e1.squareDist - e2.squareDist);
                        break;
                    case GameConstants.STRATEGY_SHOOT_WEAKEST:
                        enemies = enemies.sort((e1, e2) => e1.enemy.life - e2.enemy.life);
                        break;
                    case GameConstants.STRATEGY_SHOOT_STRONGEST:
                        enemies = enemies.sort((e1, e2) => e2.enemy.life - e1.enemy.life);
                        break;
                    case GameConstants.STRATEGY_SHOOT_FIRST:
                        enemies = enemies.sort((e1, e2) => e2.enemy.l - e1.enemy.l);
                        break;
                    default:
                }
            }

            return enemies;
        }
    }
}
