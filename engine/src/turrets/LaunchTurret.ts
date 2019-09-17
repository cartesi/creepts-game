module Anuto {

    export class LaunchTurret extends Turret {

        public explosionRange: number;
        public numMines: number;

        private minesCounter: number;
      
        constructor (p: {r: number, c: number}, engine) {
            
            super(GameConstants.TURRET_LAUNCH, p, engine);

            this.calculateTurretParameters();

            this.numMines = 0;
            this.minesCounter = 0;
          
            this.projectileSpeed = GameConstants.MORTAR_SPEED;
        }

        public update(): void {

            // cuando tiene grado 2 no hace falta calcular los enemigos que tenga en el radio de accion
            if (this.grade === 2) {

                if (this.readyToShoot) {

                    this.readyToShoot = false;   
                    this.shoot();
            
                } else {
    
                    this.f ++;
    
                    if (this.f >= this.reloadTicks) {
                        this.readyToShoot = true;
                        this.f = 0;
                    }
                }

            } else {

                super.update();
            }
        }

        protected calculateTurretParameters(): void {

            switch (this.grade) { 

                case 1:

                    this.damage = Math.round( (1 / 3) * Math.pow(this.level, 3) + 4 * Math.pow(this.level, 2) + (137 / 3) * this.level + 50);
                    this.explosionRange = Math.round((.05 * this.level + 1.45) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 2.05) * 100) / 100;
                    this.range =  Math.round((.05 * this.level + 2.45) * 100) / 100;
                    this.priceImprovement =  Math.round( (1 / 6) * Math.pow(this.level, 3) + (3 / 2) * Math.pow(this.level, 2) + (58 / 3) * this.level + 104);
                    this.priceUpgrade = 10000;
            
                    break;

                case 2:

                    this.damage = Math.round( (43 / 6) * Math.pow(this.level, 3) + 11 * Math.pow(this.level, 2) + (1121 / 3) * this.level + 2895);
                    this.explosionRange = Math.round((.05 * this.level + 1.95) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 2.6) * 100) / 100;
                    this.range =  2.5;
                    this.priceImprovement =  Math.round( 8 * Math.pow(this.level, 3) + 12 * Math.pow(this.level, 2) + 208 * this.level + 522);
                    this.priceUpgrade = 103000;
          
                    break;

                case 3: 

                    this.damage = Math.round( (50 / 3) * Math.pow(this.level, 3) + (850 / 3) * this.level + 47700);
                    this.explosionRange = Math.round((.05 * this.level + 1.7) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 3.05) * 100) / 100;
                    this.range =  Math.round((.1 * this.level + 2.9) * 100) / 100;
                    this.priceImprovement =  Math.round( (39 / 2) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (665 / 2) * this.level + 596);
            
                    this.projectileSpeed = 2 * GameConstants.MORTAR_SPEED;

                    break;

                default:
            }

            super.calculateTurretParameters();
        }

        protected getPathCellsInRange(): {r: number, c: number}[] {

            let cells = [];

            for (let i = 0; i < this.engine.enemiesPathCells.length; i++) {

                let cell = this.engine.enemiesPathCells[i];

                if (cell.c >= this.position.c && cell.c <= this.position.c + this.range ||
                    cell.c <= this.position.c && cell.c >= this.position.c - this.range) {

                        if (cell.r >= this.position.r && cell.r <= this.position.r + this.range ||
                            cell.r <= this.position.r && cell.r >= this.position.r - this.range) {

                                cells.push(cell);
                            }
                    }
            }

            return cells;
        }

        protected shoot(): void {

            if (this.grade === 2) {
                
                let cells: {r: number, c: number}[] = this.getPathCellsInRange();

                if (cells.length > 0 && this.numMines < this.level + 3) {
                    let cell = cells[this.minesCounter % cells.length];
                    this.minesCounter++;
                    this.numMines++;

                    const dx = (cell.c + .5) - this.x;
                    const dy = (cell.r + .5) - this.y;
                    this.shootAngle = MathUtils.fixNumber(Math.atan2(dy, dx));

                    const mine = new Mine({c: cell.c, r: cell.r}, this.explosionRange, this.damage, this, this.engine);
                    this.engine.addMine(mine, this);

                } else {
                    this.readyToShoot = true;
                }

            } else {

                let enemy: Enemy;

                if (this.fixedTarget) {
                    enemy = this.followedEnemy || this.enemiesWithinRange[0];
                } else {
                    enemy = this.enemiesWithinRange[0];
                }

                let ticksToImpact: number;
                let impactPosition: {x: number, y: number};
                let d = this.range;

                let iterations: number;

                if (enemy.type === GameConstants.ENEMY_RUNNER || enemy.type === GameConstants. ENEMY_FLIER) {
                    iterations = 3;
                } else {
                    iterations = 2;
                }

                for (let i = 0; i < iterations; i ++) {
                    ticksToImpact = Math.floor(d / this.projectileSpeed);
                    impactPosition = enemy.getNextPosition(ticksToImpact);
                    d = MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
                }

                const dx = impactPosition.x - this.x;
                const dy = impactPosition.y - this.y;
    
                this.shootAngle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                const mortar = new Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage, this.grade, this, this.engine);
    
                this.engine.addMortar(mortar, this);
            }
        }
    }
}
