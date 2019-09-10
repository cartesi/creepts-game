module Anuto {

    export class Turret {

        public static readonly DOWNGRADE_PERCENT = .97;

        public id: number;
        public creationTick: number;
        public type: string;
        public level: number;
        public maxLevel: number;
        public grade: number;
        public x: number;
        public y: number;
        public damage: number;
        public reload: number;
        public range: number;
        public inflicted: number;
        public priceImprovement: number;
        public priceUpgrade: number;
        public value: number;
        public sellValue: number;
        public position: {r: number, c: number};
        public shootingStrategy: string;
        public shootingStrategyIndex: number;
        public fixedTarget: boolean;
        public enemiesWithinRange: Enemy[];
        public followedEnemy: Enemy;
        public shootAngle: number;
        
        protected f: number;
        protected reloadTicks: number;
        protected readyToShoot: boolean;
        protected projectileSpeed: number;
        protected engine: Engine;
        
        constructor (type: string, p: {r: number, c: number}, engine: Engine) {

            this.engine = engine;

            this.id = engine.turretId;
            engine.turretId ++;

            this.creationTick = this.engine.ticksCounter;
            
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.maxLevel = 10;
            this.grade = 1;
            this.inflicted = 0;
            this.position = p;
            this.fixedTarget = true;
            this.shootingStrategyIndex = 0;
            this.shootingStrategy = GameConstants.STRATEGIES_ARRAY[this.shootingStrategyIndex];
            this.readyToShoot = true;
            this.enemiesWithinRange = [];
            this.followedEnemy = null;

            this.x = this.position.c + .5;
            this.y = this.position.r + .5;

            this.value = this.engine.turretData[this.type].price;
            this.sellValue = Math.round(this.engine.turretData[this.type].price * Turret.DOWNGRADE_PERCENT);
        }

        public destroy(): void {
            //
        }

        public update(): void {

            this.enemiesWithinRange = this.getEnemiesWithinRange();

            if (this.readyToShoot) {

                if (this.enemiesWithinRange.length > 0) {
                    this.readyToShoot = false;   
                    this.shoot();
                }
            
            } else {

                this.f ++;

                if (this.f >= this.reloadTicks) {
                    this.readyToShoot = true;
                    this.f = 0;
                }
            }
        }

        public ageTurret(): void {

            this.sellValue = Math.round(this.sellValue * Turret.DOWNGRADE_PERCENT);
        }

        public improve(): void {

            this.value += this.priceImprovement;
            this.sellValue += this.priceImprovement;

            this.level ++;
            this.calculateTurretParameters();                                                                                                                                        
        }

        public upgrade(): void {

            this.value += this.priceUpgrade;
            this.sellValue += this.priceUpgrade;

            this.grade ++;
            this.level = 1;

            if (this.grade === 3 && this.type !== GameConstants.TURRET_GLUE) {
                this.maxLevel = 15;
            }

            this.f = 0;
            
            this.calculateTurretParameters();
        }

        public setNextStrategy(): void {

            this.shootingStrategyIndex = this.shootingStrategyIndex === GameConstants.STRATEGIES_ARRAY.length - 1 ? 0 : this.shootingStrategyIndex + 1;
            this.shootingStrategy = GameConstants.STRATEGIES_ARRAY[this.shootingStrategyIndex];
        }

        public setFixedTarget(): void {

            this.fixedTarget = !this.fixedTarget;
        }

        protected calculateTurretParameters(): void {
            
            this.reloadTicks = Math.floor(GameConstants.RELOAD_BASE_TICKS * this.reload);
        }

        protected shoot(): void {
            // override
        }

        protected getEnemiesWithinRange(): Enemy [] {

            let enemiesAndSquaredDistances: {enemy: Enemy, squareDist: number} [] = [];
            const squaredRange = MathUtils.fixNumber(this.range * this.range);
            
            for (let i = 0; i < this.engine.enemies.length; i ++) {

                const enemy = this.engine.enemies[i];

                if (enemy.life > 0 && enemy.l < this.engine.enemiesPathCells.length - 1.5 && !enemy.teleporting) {

                    let dx: number;
                    let dy: number;

                    // el laser y el pegamento son instantaneos
                    if (this.type === GameConstants.TURRET_LASER || this.type === GameConstants.TURRET_GLUE) {

                        dx = this.x - enemy.x;
                        dy = this.y - enemy.y;

                    } else {

                        // donde estaran los enemigos cuando les impacten los proyectiles teniendo en cuenta la velocidad de estos?
                        const deltaTicks = Math.round(this.range / this.projectileSpeed * .75);
                        const enemyNextPosition = enemy.getNextPosition(deltaTicks);

                        if (!enemyNextPosition) {
                            continue;
                        }

                        dx = this.x - enemyNextPosition.x;
                        dy = this.y - enemyNextPosition.y;
                    }

                    const squaredDist = MathUtils.fixNumber(dx * dx + dy * dy);    

                    if (squaredRange >= squaredDist) {   
                        enemiesAndSquaredDistances.push({enemy: enemy, squareDist: squaredDist});
                    }
                }
            }

            if (enemiesAndSquaredDistances.length > 1 && (this.type === GameConstants.TURRET_PROJECTILE || this.type === GameConstants.TURRET_LASER  || (this.type === GameConstants.TURRET_LAUNCH && this.grade !== 2))) {
        
                // ordenar a los enemigos dentro del radio de acción según la estrategia de disparo
                switch (this.shootingStrategy) {
                    case GameConstants.STRATEGY_SHOOT_LAST:
                        enemiesAndSquaredDistances = MathUtils.mergeSort(enemiesAndSquaredDistances, (e1, e2) => (e1.enemy.l - e2.enemy.l) < 0);
                        break;
                    case GameConstants.STRATEGY_SHOOT_CLOSEST:
                       
                        enemiesAndSquaredDistances = MathUtils.mergeSort(enemiesAndSquaredDistances, (e1, e2) => (e1.squareDist - e2.squareDist) < 0);
                        break;
                    case GameConstants.STRATEGY_SHOOT_WEAKEST:
            
                        enemiesAndSquaredDistances = MathUtils.mergeSort(enemiesAndSquaredDistances, function(e1: {enemy: Enemy, squareDist: number} , e2: {enemy: Enemy, squareDist: number}): boolean {
                            
                            let ret: boolean;

                            if (e1.enemy.life === e2.enemy.life) {
                                ret = (e1.enemy.l - e2.enemy.l) > 0;
                            } else {
                                ret = e1.enemy.life - e2.enemy.life < 0;
                            }

                            return ret;
                        });
                        
                        break;

                    case GameConstants.STRATEGY_SHOOT_STRONGEST:
  
                        enemiesAndSquaredDistances = MathUtils.mergeSort(enemiesAndSquaredDistances, function(e1: {enemy: Enemy, squareDist: number} , e2: {enemy: Enemy, squareDist: number}): boolean {
                            
                            let ret: boolean;

                            if (e1.enemy.life === e2.enemy.life) {
                                ret = (e1.enemy.l - e2.enemy.l) > 0;
                            } else {
                                ret = e1.enemy.life - e2.enemy.life > 0;
                            }

                            return ret;
                        });
                        
                        break;
                    case GameConstants.STRATEGY_SHOOT_FIRST:
                        enemiesAndSquaredDistances = MathUtils.mergeSort(enemiesAndSquaredDistances, (e1, e2) => (e1.enemy.l - e2.enemy.l) > 0);
                        break;
                    default:
                }
            }

            const enemies: Enemy[] = [];

            for (let i = 0; i < enemiesAndSquaredDistances.length; i ++) {
                enemies.push(enemiesAndSquaredDistances[i].enemy);
            }

            return enemies;
        }
    }
}
