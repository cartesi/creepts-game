// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { Engine } from "../Engine";

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
            //
        }

        public update(): void {

            this.f++;

            if (this.f === this.duration) {

                this.consumed = true;
            }
        }
    }
