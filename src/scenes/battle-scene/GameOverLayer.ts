// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { GameManager } from "./../../GameManager";
import { BattleManager } from "./BattleManager";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BattleScene } from "./BattleScene";
import { MenuButton } from "./gui/MenuButton";
import { MenuTitle } from "./gui/MenuTitle";

export class GameOverLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);

        // upper and lower margin for the dialog, and gap between elements
        const margin = 30;
        const gap = 20;

        // this is a box for the content, vertically centered
        // XXX: it's not really vertically centered, because we don't calculate the total height at this point
        const box = new Phaser.GameObjects.Container(this.scene);
        box.setPosition(0, -GameConstants.GAME_HEIGHT / 4);

        // this is a black background with transparency
        const background = new Phaser.GameObjects.Graphics(this.scene);
        box.add(background);

        // vertical position, increment on each new element, start with a margin
        let y = 0 + margin;

        // screen title
        const title = new MenuTitle(this.scene, "GAME OVER");
        title.setPosition(0, y + (title.height / 2));
        box.add(title);
        y += title.height + gap;

        // score
        const scoreHeight = 80;
        const score = new Phaser.GameObjects.Text(this.scene, 0, y + (scoreHeight / 2), "SCORE: " + GameVars.formatNumber(BattleManager.engine.score), {fontFamily: "Rubik-Regular", fontSize: "65px", color: "#FFFFFF"});
        score.setOrigin(.5);
        box.add(score);
        y += scoreHeight;

        // restart button
        const restartButton = new MenuButton(this.scene, "RESTART", () => GameManager.reset());
        restartButton.setPosition(0, y + (restartButton.height / 2));
        box.add(restartButton);
        y += restartButton.height + gap / 2;

        // exit button, just emit an exit event
        if (!GameConstants.GAME_ONLY) {
            const exitButton = new MenuButton(this.scene, "EXIT", () => GameManager.events.emit("exit") );
            exitButton.setPosition(0, y + (exitButton.height / 2));
            box.add(exitButton);
            y += exitButton.height + margin / 2;
        }

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500
        });

        if (GameVars.currentScene !== BattleScene.currentInstance) {
            restartButton.setEnabled(false);
        }

        // set the size with final y
        box.setSize(GameConstants.GAME_WIDTH, y);

        // draw black background with the final y height
        background.fillStyle(0x0B003E);
        background.fillRect(-GameConstants.GAME_WIDTH / 2, 0, GameConstants.GAME_WIDTH, y);
        background.alpha = .75;

        this.add(box);
    }

}
