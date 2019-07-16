namespace Anuto {

    export class Bullet {

        public x: number;
        public y: number;

        private dx: number;
        private dy: number;

        constructor (p: {r: number, c: number}, angle: number, speed: number) {
            
            this.x = p.c * GameVars.cellsSize;
            this.y = p.r * GameVars.cellsSize;

            this.dx = speed * Math.cos(angle);
            this.dy = speed * Math.sin(angle);
        }

        public update(): void {
            
            this.x += this.dx;
            this.y += this.dy;
        }

        public getPositionNextTick(): {x: number, y: number} {

            return {x: this.x + this.dx, y: this.y + this.dy};
        }
    }
}
