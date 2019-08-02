module Anuto {

    export class Event {

        public static readonly ENEMY_SPAWNED = "enemy spawned";
        public static readonly ENEMY_KILLED = "enemy killed";
        public static readonly ENEMY_HIT = "enemy hit by bullet";
        public static readonly ENEMY_REACHED_EXIT = "enemy reached exit";
        public static readonly WAVE_OVER = "wave over";
        public static readonly BULLET_SHOT = "bullet shot";
        public static readonly LASER_SHOT = "laser shot";
        public static readonly MORTAR_SHOT = "mortar shot";
        public static readonly GLUE_SHOT = "glue shot";
        public static readonly GLUE_CONSUMED = "glue consumed";

        private type: string;
        private params: any;

        constructor(type: string, params?: any) {

            this.type = type;
            this.params = params;
        }

        public getParams(): any {

            return this.params;
        }

        public getType(): string {

            return this.type;
        }
    }
}
