// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { TurretActor } from "./TurretActor";
import { GameVars } from "../../../GameVars";
import * as Creepts from "../../../../engine/src";

export class LaunchTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}, turret: Creepts.Turret) {

        super(scene, Creepts.GameConstants.TURRET_LAUNCH, position, turret);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_4_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.base.on("pointerover", this.onOverTurret, this);
        this.base.on("pointerout", this.onOutTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_4_1_1");
        this.add(this.canon);

        this.bringToTop(this.turretLevel);
    }

    public update(time: number, delta: number): void {
        //
    }

    public upgrade(): void {

        super.upgrade();

        switch (this.turret.grade) {
 
             case 2:
                 this.base.setFrame("base_4_2");
                 this.canon.setFrame("canon_4_2_1");
                 break;
             case 3: 
                 this.base.setFrame("base_4_2");
                 this.canon.setFrame("canon_4_3_1");
                 break;
             default:
        }
    }

    public shootMortar(): void {
        this.canon.rotation = this.turret.shootAngle + Math.PI / 2;

        this.scene.tweens.add({
            targets: this.canon,
            x: this.canon.x - 5 * Math.sin(this.canon.rotation),
            y: this.canon.y + 5 * Math.cos(this.canon.rotation),
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 300 : 75,
            yoyo: true
        });
    }

    public shootMine(): void {
        
        this.canon.rotation = this.turret.shootAngle + Math.PI / 2;

        this.scene.tweens.add({
            targets: this.canon,
            x: this.canon.x - 5 * Math.sin(this.canon.rotation),
            y: this.canon.y + 5 * Math.cos(this.canon.rotation),
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 80 : 20,
            yoyo: true
        });
    }
}
