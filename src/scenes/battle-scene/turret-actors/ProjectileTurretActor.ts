// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { AudioManager } from './../../../AudioManager';
import { TurretActor } from "./TurretActor";
import { GameVars } from '../../../GameVars';
import * as Creepts from "@cartesi/creepts-engine";

export class ProjectileTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}, turret: Creepts.Turret) {

        super(scene, Creepts.GameConstants.TURRET_PROJECTILE, position, turret);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_1_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.base.on("pointerover", this.onOverTurret, this);
        this.base.on("pointerout", this.onOutTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_1_1_1");
        this.add(this.canon);

        this.bringToTop(this.turretLevel);
    }

    public upgrade(): void {

        super.upgrade();

        switch (this.turret.grade) {
 
            case 2:
                this.base.setFrame("base_1_2");
                this.canon.setFrame("canon_1_2_1");
                break;
            case 3: 
                this.base.setFrame("base_1_3");
                this.canon.setFrame("canon_1_3_1");
                break;
            default:
        }
    }

    public shootBullet(): void {
        
        this.canon.rotation = this.turret.shootAngle + Math.PI / 2;
        AudioManager.playSound("t1_bullets");

        this.scene.tweens.add({
            targets: this.canon,
            x: - 5 * Math.sin(this.canon.rotation),
            y: 5 * Math.cos(this.canon.rotation),
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 40 : 10,
            onComplete: () => {
                if (!this.scene) {
                    return;
                }
                
                this.scene.tweens.add({
                    targets: this.canon,
                    x: 0,
                    y: 0,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: GameVars.timeStepFactor === 1 ? 40 : 10
                });
            },
            onCompleteScope: this
        });
    }
}
