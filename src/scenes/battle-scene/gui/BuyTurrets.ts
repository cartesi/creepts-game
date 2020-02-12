// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { TurretButton } from "./TurretButton";
import * as Creepts from "@cartesi/creepts-engine";

export class BuyTurrets extends Phaser.GameObjects.Container {

    private turretButtons: TurretButton[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 33;
        this.x = 130;

        this.turretButtons = [];

        let types = [Creepts.GameConstants.TURRET_PROJECTILE, Creepts.GameConstants.TURRET_LASER, Creepts.GameConstants.TURRET_LAUNCH, Creepts.GameConstants.TURRET_GLUE];

        for (let i = 0; i < 4; i++) {

            let turretButton = new TurretButton(this.scene, types[i], i);
            this.add(turretButton);
            this.turretButtons.push(turretButton);
        }
    }
}
