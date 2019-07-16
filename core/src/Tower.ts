module Anuto {

    export class Tower {

        public type: string;
        public level: number;
        public damage: number;
        public reload: number;
        public range: number;
        public value: number;

        constructor () {
            
            this.value = 0;
        }

        public destroy(): void {
            //
        }

        public update(): void {
            //
        }

        public upgrade(): void {
            
            this.level ++;
        }
    }
}
