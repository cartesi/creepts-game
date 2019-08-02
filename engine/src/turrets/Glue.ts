module Anuto {

    export class Glue {

        public static id: number;

        public id: number;
        public x: number;
        public y: number;
        public intensity: number;
        public duration: number;
        public range: number;
        public gluesArray: Glue[];

        private f: number;


        constructor (p: {r: number, c: number}, intensity: number, duration: number, range: number) {
            
            this.id = Bullet.id;
            Glue.id ++;

            this.x = p.c + .5;
            this.y = p.r + .5;

            this.intensity = intensity;
            this.duration = duration;
            this.range = range;

            this.f = 0;
            
        }

        public destroy(): void {
            //
        }

        public update(): void {

            this.f++;

            if (this.f === this.duration) {

                const i = this.gluesArray.indexOf(this);
                this.gluesArray.splice(i, 1);
                this.destroy();

                Engine.currentInstance.destroyGlue(this);
            }
        }
    }
}
