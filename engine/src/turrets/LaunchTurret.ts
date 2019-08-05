module Anuto {

    export class LaunchTurret extends Turret {

        // se va desviando del objetivo de una manera ciclica
        private static deviationRadius = 0; // puede ser 0, .25. .5 ó .75   1 de cada 4 veces disparara al enemigo en el centro
        private static deviationAngle = 0; // se va incrementando de 45 en 45 grados

        public explosionRange: number;

        constructor (p: {r: number, c: number}) {
            
            super(GameConstants.TURRET_LAUNCH, p);

            this.calculateTurretParameters();
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

        protected shoot(): void {

            super.shoot();

            let enemy: Enemy;

            if (this.fixedTarget) {
                enemy = this.followedEnemy || this.enemiesWithinRange[0];
            } else {
                enemy = this.enemiesWithinRange[0];
            }
        
            let d = MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));

            // cuantos ticks va a tardar el mortero en llegar?
            let ticksToImpact = Math.floor(MathUtils.fixNumber(d / GameConstants.MORTAR_SPEED));

            // encontrar la posicion del enemigo dentro de estos ticks
            const impactPosition = enemy.getNextPosition(ticksToImpact);

            // le damos una cierta desviacion para que no explote directamente justo encima del enemigo
            const deviation_x = MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.cos(LaunchTurret.deviationAngle * Math.PI / 180));
            const deviation_y = MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.sin(LaunchTurret.deviationAngle * Math.PI / 180));

            impactPosition.x += deviation_x;
            impactPosition.y += deviation_y;

            LaunchTurret.deviationRadius = LaunchTurret.deviationRadius === .75 ? 0 : LaunchTurret.deviationRadius + .25;
            LaunchTurret.deviationAngle = LaunchTurret.deviationAngle === 315 ? 0 : LaunchTurret.deviationAngle + 45;

            // el impacto se producirá dentro del alcance de la torreta?
            d = MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
            
            if (d < this.range){

                // recalculamos los ticks en los que va a impactar ya que estos determinan cuando se hace estallar al mortero
                ticksToImpact = Math.floor(MathUtils.fixNumber(d / GameConstants.MORTAR_SPEED));

                const dx = impactPosition.x - this.x;
                const dy = impactPosition.y - this.y;
    
                this.shootAngle =  MathUtils.fixNumber(Math.atan2(dy, dx));
                const mortar = new Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage);
    
                Engine.currentInstance.addMortar(mortar, this);

            } else {

                // no se lanza el mortero y se vuelve a estar disponible para disparar
                this.readyToShoot = true;
            }
        }
    }
}
