// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { AudioManager } from "./../../../AudioManager";
import { TurretActor } from "./TurretActor";
import { GameVars } from "../../../GameVars";
import { EnemyActor } from "../enemy-actors/EnemyActor";
import * as Creepts from "../../../../engine/src";

export class LaserTurretActor extends TurretActor {

    private framesDuration: number;
    private f: number;
    private laserShoot: boolean;

    constructor(scene: Phaser.Scene, position: {r: number, c: number}, turret: Creepts.Turret) {

        super(scene, Creepts.GameConstants.TURRET_LASER, position, turret);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_2_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.base.on("pointerover", this.onOverTurret, this);
        this.base.on("pointerout", this.onOutTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_2_1_1");
        this.add(this.canon);

        this.canonLength = 30;

        this.laserShoot = false;

        this.bringToTop(this.turretLevel);
    }

    public update(time: number, delta: number): void {

        if (this.laserShoot) {
            if (this.f ++ === this.framesDuration) {
                this.laserShoot = false;
            }
            return;
        }

        super.update(time, delta);
    }

    public upgrade(): void {

        super.upgrade();

        switch (this.turret.grade) {
 
             case 2:
                this.base.setFrame("base_2_2");
                this.canon.setFrame("canon_2_2_1");
                break;
             case 3: 
                this.base.setFrame("base_2_2");
                this.canon.setFrame("canon_2_3_1");
                break;
             default:
        }
    }

    public shootLaser(enemyActors: EnemyActor[]): void {

        const dx = enemyActors[0].x - this.x;
        const dy = enemyActors[0].y - this.y;

        this.canon.rotation = Math.atan2(dy, dx) + Math.PI / 2;

        this.laserShoot = true;
        this.framesDuration = GameVars.timeStepFactor === 1 ? 24 : 6;
        this.f = 0;

        AudioManager.playSound("t2_laser" + this.turret.grade);
    }
}
