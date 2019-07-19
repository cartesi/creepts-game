module Anuto {

    export class Tower {

        public type: string;
        public level: number;
        public damage: number;
        public reload: number;
        public range: number;
        public value: number;

        public position: {r: number, c: number};

        public creationTick: number;

        constructor (config: Types.TowerConfig, creationTick: number) {

            this.type = config.id;
            this.level = config.level;
            this.position = config.position;

            // sacar el resto de valores                                                                                                    
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
