module Anuto {

    export class Glue {

        public id: number;
        public x: number;
        public y: number;
        public intensity: number;
        public duration: number;
        public range: number;
        public consumed: boolean;
       
        private f: number;

        constructor (p: {r: number, c: number}, intensity: number, duration: number, range: number, engine: Engine) {
            
            this.id = engine.glueId;
            engine.glueId ++;

            this.x = p.c + .5;
            this.y = p.r + .5;

            this.intensity = intensity;
            this.duration = duration;
            this.range = range;
            this.consumed = false;

            this.f = 0;
        }

        public destroy(): void {
            // nada de momento
        }

        public update(): void {

            this.f++;

            if (this.f === this.duration) {

                this.consumed = true;
            }
        }
    }
}
