module Anuto {

    export class EventDispatcher {

        private listeners: any[];

        constructor() {

            this.listeners = [];
        }

        public hasEventListener (type: string, listener: Function): boolean {

            let exists = false;

            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listener) {
                    exists = true;
                }
            }

            return exists;
        }

        public addEventListener (type: string, listenerFunc: Function, scope: any): void {
            
            if (this.hasEventListener(type, listenerFunc)) {
                return;
            }

            this.listeners.push({type: type, listener: listenerFunc, scope: scope});
        }

        public removeEventListener (type: string, listenerFunc: Function): void {

            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listenerFunc) {
                    this.listeners.splice(i, 1);
                }
            }
        }

        public dispatchEvent (evt: Event): void {

            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === evt.getType()) {
                    this.listeners[i].listener.apply(this.listeners[i].scope, evt.getParams());
                }
            }
        }
    }
}
