module Anuto {

    export class LaunchTurret extends Turret {

        public explosionRange: number;
        public numMines: number;

        private minesCounter: number;
        // se va desviando del objetivo de una manera ciclica
        private  deviationRadius: number; // puede ser 0, .25. .5 ó .75   1 de cada 4 veces disparara al enemigo en el centro
        private  deviationAngle: number; // se va incrementando de 45 en 45 grados

        constructor (p: {r: number, c: number}, engine) {
            
            super(GameConstants.TURRET_LAUNCH, p, engine);

            this.calculateTurretParameters();

            this.numMines = 0;
            this.minesCounter = 0;
            this.deviationAngle = 0;
            this.deviationRadius = 0;
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

            super.shoot();

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
            
                let d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));

                let speed = this.grade === 3 ? GameConstants.MORTAR_SPEED * 5 : GameConstants.MORTAR_SPEED;

                // cuantos ticks va a tardar el mortero en llegar?
                let ticksToImpact = Math.floor(MathUtils.fixNumber(d / speed));

                // encontrar la posicion del enemigo dentro de estos ticks
                const impactPosition = enemy.getNextPosition(ticksToImpact);

                if (this.grade === 1) {
                    // le damos una cierta desviacion para que no explote directamente justo encima del enemigo
                    const deviation_x = MathUtils.fixNumber(this.deviationRadius * Math.cos(this.deviationAngle * Math.PI / 180));
                    const deviation_y = MathUtils.fixNumber(this.deviationRadius * Math.sin(this.deviationAngle * Math.PI / 180));

                    impactPosition.x += deviation_x;
                    impactPosition.y += deviation_y;

                    this.deviationRadius = this.deviationRadius === .75 ? 0 : this.deviationRadius + .25;
                    this.deviationAngle = this.deviationAngle === 315 ? 0 : this.deviationAngle + 45;
                }

                // el impacto se producirá dentro del alcance de la torreta?
                d = MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
                
                if (d < this.range){

                    // recalculamos los ticks en los que va a impactar ya que estos determinan cuando se hace estallar al mortero
                    let speed = this.grade === 3 ? GameConstants.MORTAR_SPEED * 5 : GameConstants.MORTAR_SPEED;

                    ticksToImpact = Math.floor(MathUtils.fixNumber(d / speed));

                    const dx = impactPosition.x - this.x;
                    const dy = impactPosition.y - this.y;
        
                    this.shootAngle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                    const mortar = new Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage, this.grade, this, this.engine);
        
                    this.engine.addMortar(mortar, this);

                } else {

                    // no se lanza el mortero y se vuelve a estar disponible para disparar
                    this.readyToShoot = true;
                }
            }
        }
    }
}
