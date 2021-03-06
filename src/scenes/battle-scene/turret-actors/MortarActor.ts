// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { BoardContainer } from "../BoardContainer";
import { BattleManager } from "../BattleManager";
import { AudioManager } from "../../../AudioManager";
import * as Creepts from "@cartesi/creepts-engine";

export class MortarActor extends Phaser.GameObjects.Container {

    public mortar: Creepts.Mortar;

    private mortarImage: Phaser.GameObjects.Image;
    private detonated: boolean;
    private initialPosition: {x: number, y: number};
    private deltaAngle: number;
    
    constructor(scene: Phaser.Scene, mortar: Creepts.Mortar) {

        super(scene);

        this.mortar = mortar;
        this.detonated = false;

        this.x = this.mortar.x * GameConstants.CELLS_SIZE;
        this.y = this.mortar.y * GameConstants.CELLS_SIZE;

        this.initialPosition = {x: this.x, y: this.y};

        this.mortarImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", mortar.grade === 1 ? "granade" : "bullet_4_3");
        this.mortarImage.setScale(.5);
        this.add(this.mortarImage);

        this.rotation = Math.random() * Math.PI;

        this.visible = false;

        this.deltaAngle = Math.random() > .5 ? .5 : -.5;

        if (this.mortar.grade === 1) {
            AudioManager.playSound("t1_cannon");
        } else {
            AudioManager.playSound("t3_missile_launcher");
        }
    }

    public update(time: number, delta: number): void {

        if (this.detonated) {
            return;
        }

        if (!this.visible) {
            let distX = this.initialPosition.x - this.x;
            let distY = this.initialPosition.y - this.y;
            if (Math.sqrt( distX * distX + distY * distY) > 30) {
                this.visible = true;
            }
        }

        const tick = BattleManager.engine.ticksCounter;
        const dt = tick - this.mortar.creationTick;
        let scale: number;

        if (dt < this.mortar.ticksToImpact / 2) {
            scale = .75 * ( 1 + dt / (this.mortar.ticksToImpact / 2));
        } else {
            scale = .75 * ( 1 +  (this.mortar.ticksToImpact - dt) / (this.mortar.ticksToImpact / 2)); 
        }

        this.mortarImage.setScale(scale);

        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = GameVars.timeStepFactor === 1 ? .2 : .65;
        } else {
            smoothFactor = 1;
        }

        let offX = (this.mortar.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        let offY = (this.mortar.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;

        this.x += offX;
        this.y += offY; 

        if (this.mortar.grade === 3) {
            this.rotation = Math.atan2(offY, offX) + Math.PI / 2;
        } 

        if (this.mortar.grade === 1) {
            this.mortarImage.angle += this.deltaAngle;
        }
    }

    public detonate(): void {

        this.visible = true;
        this.detonated = true;
        this.mortarImage.visible = false;

        const explosionEffect = this.scene.add.sprite(0, 0, "texture_atlas_1", "tower4_fx_01");
        if (this.mortar.turret.grade === 1) {
            explosionEffect.setScale(.5);
            AudioManager.playSound("t1_explosion");
        } else if (this.mortar.turret.grade === 3) {
            explosionEffect.setScale(.75);
            AudioManager.playSound("t2_mine_explosion");
        }
        this.add(explosionEffect);

        explosionEffect.anims.play("explosion");

        explosionEffect.on("animationcomplete", () => {
            BoardContainer.currentInstance.removeMortar(this);
        }, this);

        
    }
}
