// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { BoardContainer } from './BoardContainer';
import { BattleManager } from './BattleManager';

export class RoundCompletedLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);

        const titleBck = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "title_area");
        this.add(titleBck);

        let score = new Phaser.GameObjects.Text(this.scene, 0, 0, "ROUND  " + BattleManager.engine.round + "  COMPLETED", {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
        score.setOrigin(.5);
        this.add(score);

        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500
        });

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            delay: 2000,
            onComplete: () => {
                BoardContainer.currentInstance.hideRoundCompletedLayer();
            },
            onCOmpleteScope: this
        });
    }
}
