module Anuto {

    export class Event {

        public static readonly EVENT_ENEMY_SPAWNED = "enemy spawned";
        public static readonly EVENT_ENEMY_KILLED = "enemy killed";
        public static readonly EVENT_ENEMY_REACHED_EXIT = "enemy reached exit";

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
