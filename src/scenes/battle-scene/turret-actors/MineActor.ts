// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { LaunchTurretActor } from './LaunchTurretActor';
import { GameConstants } from "../../../GameConstants";
import { GameVars } from '../../../GameVars';
import { BoardContainer } from '../BoardContainer';
import * as Creepts from "@cartesi/creepts-engine";
import { AudioManager } from '../../../AudioManager';

export class MineActor extends Phaser.GameObjects.Container {

    public mine: Creepts.Mine;

    private mineImage: Phaser.GameObjects.Sprite;
    private detonated: boolean;

    constructor(scene: Phaser.Scene, mine: Creepts.Mine, launchTurretActor: LaunchTurretActor) {

        super(scene, 0, 0);

        this.mine = mine;
        this.detonated = false;

        let randX = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 3;
        let randY = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 3;

        this.x = launchTurretActor.x;
        this.y = launchTurretActor.y;

        this.mineImage = this.scene.add.sprite(0, 0, "texture_atlas_1");
        this.mineImage.setScale(.5);
        this.add(this.mineImage);

        this.mineImage.anims.play("mine");

        this.scene.tweens.add({
            targets: this,
            x: this.mine.x * GameConstants.CELLS_SIZE + randX,
            y: this.mine.y * GameConstants.CELLS_SIZE + randY,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 600 : 200,
        });

        AudioManager.playSound("t2_mine_launcher");

    }

    public update(time: number, delta: number): void {
        
        // 
    }

    public detonate(): void {

        this.detonated = true;

        this.mineImage.visible = false;
        
        let explosionEffect = this.scene.add.sprite(0, 0, "texture_atlas_1", "tower4_fx_01");
        explosionEffect.setScale(.75);
        this.add(explosionEffect);

        explosionEffect.anims.play("explosion");

        explosionEffect.on("animationcomplete", () => {
            BoardContainer.currentInstance.removeMine(this);
        }, this);

        AudioManager.playSound("t2_mine_explosion");
    }
}
