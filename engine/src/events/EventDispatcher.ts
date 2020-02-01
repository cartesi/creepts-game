// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { Event } from "./Event";

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
