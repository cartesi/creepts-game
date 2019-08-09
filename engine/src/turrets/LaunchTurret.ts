module Anuto {

    export class LaunchTurret extends Turret {

        // se va desviando del objetivo de una manera ciclica
        private static deviationRadius = 0; // puede ser 0, .25. .5 ó .75   1 de cada 4 veces disparara al enemigo en el centro
        private static deviationAngle = 0; // se va incrementando de 45 en 45 grados

        private minesCounter: number;

        public explosionRange: number;

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_LAUNCH, p);

            this.calculateTurretParameters();

            this.minesCounter = 0;
        }

        // mirar en el ANUTO y generar las formulas que correspondan
        protected calculateTurretParameters(): void {

            this.damage = Math.floor( 1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
            this.reload = Math.round(((-2 / 18) * this.level + 38 / 18 ) * 10) / 10;
            this.range =  Math.round((2 / 45 * this.level + 221 / 90) * 10) / 10;
            
            // mirar los parametros del juego anuto e implementar la correspondiente formula
            this.explosionRange = this.range * .6;
            
            this.priceImprovement =  Math.floor( 29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            
            // esto hay que calcularlo tambien
            this.priceUpgrade = 10000 * this.grade;

            if (this.level === 1) {
                this.value = GameVars.turretData[this.type].price;
            } else {
                // calcularlo
            }

            super.calculateTurretParameters();
        }

        protected getPathCellsInRange(): {r: number, c: number}[] {

            let cells = [];

            for (let i = 0; i < GameVars.enemiesPathCells.length; i++) {

                let cell = GameVars.enemiesPathCells[i];

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

                if (cells.length > 0) {
                    let cell = cells[this.minesCounter % cells.length];
                    this.minesCounter++;

                    const mine = new Mine({c: cell.c, r: cell.r}, this.explosionRange, this.damage);
                    Engine.currentInstance.addMine(mine, this);

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
                    const deviation_x = MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.cos(LaunchTurret.deviationAngle * Math.PI / 180));
                    const deviation_y = MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.sin(LaunchTurret.deviationAngle * Math.PI / 180));

                    impactPosition.x += deviation_x;
                    impactPosition.y += deviation_y;

                    LaunchTurret.deviationRadius = LaunchTurret.deviationRadius === .75 ? 0 : LaunchTurret.deviationRadius + .25;
                    LaunchTurret.deviationAngle = LaunchTurret.deviationAngle === 315 ? 0 : LaunchTurret.deviationAngle + 45;
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
                    const mortar = new Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage, this.grade);
        
                    Engine.currentInstance.addMortar(mortar, this);

                } else {

                    // no se lanza el mortero y se vuelve a estar disponible para disparar
                    this.readyToShoot = true;
                }
            }

            
        }
    }
}
