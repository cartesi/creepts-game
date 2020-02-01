// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { BoardContainer } from "./BoardContainer";
import { GUI } from "./gui/GUI";
import { HUD } from "./hud/HUD";
import { BattleManager } from "./BattleManager";
import { GameVars } from "../../GameVars";
import { AudioManager } from "../../AudioManager";
import { FxEnemyTraspass } from "./FxEnemyTraspass";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;
    public boardContainer: BoardContainer;

    private needSoundMusic: boolean;

    constructor() {

        super("BattleScene");
        BattleScene.currentInstance = this;
    }

    public create(): void {

        GameVars.currentScene = this;

        this.needSoundMusic = true;

        this.cameras.main.setBackgroundColor(0x000018);

        BattleManager.init();

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        this.input.on("pointerdown", () => {
            if (this.needSoundMusic) {
                this.needSoundMusic = false;
                AudioManager.playMusic("alt_soundtrack", 1, .5);
            }
        }, this);
    }

    public update(time: number, delta: number): void {

        if (!GameVars.paused && !GameVars.semipaused && !GameVars.waveOver) {
            BattleManager.update(time, delta);
            this.boardContainer.update(time, delta);
        }
        
        this.hud.update(time, delta);
    }

    public createTurret(type: string): void {

        this.gui.createTurret(type);
        this.boardContainer.hideTurretMenu();
        this.boardContainer.hideRangeCircles();
    }

    public updateTurretMenu(): void {
        this.boardContainer.updateTurretMenu();
    }

    public showFxEnemyTraspass(): void {

        let fx = new FxEnemyTraspass(this);
        this.add.existing(fx);
    }
}
