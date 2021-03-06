// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { BattleManager } from './../BattleManager';
import { GameConstants } from './../../../GameConstants';
import { GUI } from './GUI';
import { GameVars } from '../../../GameVars';
import * as Creepts from "@cartesi/creepts-engine";

export class TurretSelected extends Phaser.GameObjects.Container {

    private base: Phaser.GameObjects.Image;
    private canon: Phaser.GameObjects.Image;

    private gui: GUI;

    private turretType: string;
    private offY: number;
    private prevWorldY: number;

    constructor(scene: Phaser.Scene, type: string, gui: GUI) {

        super(scene);

        this.prevWorldY = 0;

        if (this.scene.sys.game.device.os.desktop) {
            this.offY = 0;
        } else {
            this.offY = -30;
        }

        let base_name;
        let canon_name;

        this.turretType = type;
        this.gui = gui;

        let range = GameConstants.CELLS_SIZE;

        switch (type) {

            case Creepts.GameConstants.TURRET_PROJECTILE:
                base_name = "base_1_1";
                canon_name = "canon_1_1_1";
                range *= 2.5;
                break;
            case Creepts.GameConstants.TURRET_LASER:
                base_name = "base_2_1";
                canon_name = "canon_2_1_1";
                range *= 3.05;
                break;
            case Creepts.GameConstants.TURRET_LAUNCH:
                base_name = "base_4_1";
                canon_name = "canon_4_1_1";
                range *= 2.5;
                break;
            case Creepts.GameConstants.TURRET_GLUE:
                base_name = "base_3_1";
                range *= 1.5;
                break;
            default:
        }

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", base_name);
        this.add(this.base);

        if (type !== Creepts.GameConstants.TURRET_GLUE) {
            this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", canon_name);
            this.add(this.canon);
        }

        let typeRange = "";

        switch (type) {

            case Creepts.GameConstants.TURRET_LAUNCH:
                typeRange = "yellow";
                break;
            case Creepts.GameConstants.TURRET_PROJECTILE:
                    typeRange = "green";
                break;
            case Creepts.GameConstants.TURRET_LASER:
                    typeRange = "pink";
                break;
            case Creepts.GameConstants.TURRET_GLUE:
                    typeRange = "blue";
                break;
            default:
                break;
        }

        let rangeCircle = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "area_" + typeRange);
        rangeCircle.setScale((range * 2) / rangeCircle.width);
        this.add(rangeCircle);

        this.scene.sys.updateList.add(this);

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => { this.onPointerUp(pointer); }, this);
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); }, this);
        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); }, this);
        
        GameVars.turretSelectedOn = true;
    }

    public preUpdate(time: number, delta: number): void {

        if (!this.scene.input.activePointer.isDown && GameVars.turretSelectedOn) {
            this.onPointerUp(this.scene.input.activePointer);
        }
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {

        if (!this.scene.sys.game.device.os.desktop) {
            if (this.prevWorldY > GameConstants.GAME_HEIGHT / 4 && pointer.worldY <= GameConstants.GAME_HEIGHT / 4) {
                this.offY = -60;
            } else if (this.prevWorldY < GameConstants.GAME_HEIGHT * (3 / 4) && pointer.worldY >= GameConstants.GAME_HEIGHT * (3 / 4)) {
                this.offY = 60;
            }
        }

        this.setPosition(pointer.x, (pointer.y + this.offY) / GameVars.scaleY);
        this.prevWorldY = pointer.worldY;
    }

    private onPointerUp(pointer: Phaser.Input.Pointer): void {

        let posX = (pointer.x - GameConstants.GAME_WIDTH / 2) / GameVars.scaleCorrectionFactor + ((GameVars.currentMapData.size.c * GameConstants.CELLS_SIZE) / 2);
        let posY = ((pointer.y + this.offY) - GameConstants.GAME_HEIGHT / 2 - GameConstants.CELLS_SIZE) / (GameVars.scaleCorrectionFactor * GameVars.scaleY) + ((GameVars.currentMapData.size.r * GameConstants.CELLS_SIZE) / 2);

        let c = Math.floor(posX / GameConstants.CELLS_SIZE);
        let r = Math.floor(posY / GameConstants.CELLS_SIZE);

        BattleManager.addTurretToScene(this.turretType, {r: r, c: c});
        
        this.scene.input.removeAllListeners();
        this.gui.removeTurret();

        GameVars.turretSelectedOn = false;
    }
}
