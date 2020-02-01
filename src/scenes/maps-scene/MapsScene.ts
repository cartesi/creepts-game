// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { MapInfo } from './MapInfo';
import { GameConstants } from './../../GameConstants';
import { GameVars } from "../../GameVars";

export class MapsScene extends Phaser.Scene {

    public static currentInstance: MapsScene;

    public midContainer: Phaser.GameObjects.Container;

    private lastY: number;
    private isDown: boolean;

    constructor() {

        super("MapsScene");
        MapsScene.currentInstance = this;
    }

    public create(): void {

        GameVars.currentScene = this;

        this.cameras.main.setBackgroundColor(0xffffff); 

        this.midContainer = new Phaser.GameObjects.Container(this);
        this.midContainer.scaleY = GameVars.scaleY;
        this.midContainer.x = GameConstants.GAME_WIDTH / 2;
        this.midContainer.y = 135 * GameVars.scaleY;
        this.add.existing(this.midContainer);

        this.lastY = this.midContainer.y;
        this.isDown = false;

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => { this.onPointerDown(pointer); });
        this.input.on("pointerup", () => { this.onPointerUp(); });
        this.input.on("pointerout", () => { this.onPointerUp(); });
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); });

        for (let i = 0; i < GameVars.mapsData.length; i++) {
            
            let mapInfo = new MapInfo(this, GameVars.mapsData[i], i);
            mapInfo.x = - 150 + (i % 2 === 0 ? 0 : 300);
            mapInfo.y = 350 * Math.floor(i / 2);
            this.midContainer.add(mapInfo);
        }

        const titleContainer = new Phaser.GameObjects.Container(this);
        titleContainer.scaleY = GameVars.scaleY;
        titleContainer.x = GameConstants.GAME_WIDTH / 2;
        this.add.existing(titleContainer);

        let titleBack = new Phaser.GameObjects.Graphics(this);
        titleBack.fillStyle(0xffffff);
        titleBack.fillRect(- GameConstants.GAME_WIDTH / 2, 0, GameConstants.GAME_WIDTH, 130);
        titleContainer.add(titleBack);

        const titleLines = new Phaser.GameObjects.Graphics(this);
        titleLines.setPosition(0, 65);
        titleLines.lineStyle(4, 0x000000);
        titleLines.strokeRect(-180, -35, 360, 70);
        titleLines.lineStyle(2, 0x000000);
        titleLines.strokeRect(-170, -25, 340, 50);
        titleContainer.add(titleLines);

        let title = new Phaser.GameObjects.Text(this, 0, 45, "CHANGE MAP", {fontFamily: "Rubik-Regular", fontSize: "35px", color: "#000000"});
        title.setOrigin(.5, 0);
        titleContainer.add(title);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer): void {
        this.isDown = true;
        this.lastY = pointer.worldY;
    }

    private onPointerUp(): void {
        this.isDown = false;
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {

        if (!this.isDown) {
            return;
        }

        let newY = pointer.worldY;
        this.midContainer.y -= (this.lastY - newY);
        this.lastY = newY;

        if (this.midContainer.y > 135 * GameVars.scaleY) {
            this.midContainer.y = 135 * GameVars.scaleY;
        }

        if (this.midContainer.y < -380 * GameVars.scaleY) {
            this.midContainer.y = -380 * GameVars.scaleY;
        }
    }
}
