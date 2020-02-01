// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { GameVars } from './../../GameVars';
import { GameConstants } from "../../GameConstants";
import { BattleManager } from './BattleManager';

export class FxEnemyTraspass extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        let left = new Phaser.GameObjects.Image(this.scene, 0, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        left.setOrigin(1, 0);
        left.setScale((GameConstants.GAME_HEIGHT - 122 * GameVars.scaleY) / left.width, .5);
        left.setAngle(-90);
        this.add(left);

        let right = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        right.setOrigin(1, 0);
        right.setScale((GameConstants.GAME_HEIGHT - 122 * GameVars.scaleY) / left.width, -.5);
        right.setAngle(-90);
        this.add(right);

        let top = new Phaser.GameObjects.Image(this.scene, 0, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        top.setOrigin(0);
        top.setScale(GameConstants.GAME_WIDTH / left.width, .5);
        this.add(top);

        let bottom = new Phaser.GameObjects.Image(this.scene, 0, GameConstants.GAME_HEIGHT, "texture_atlas_1", "fx_enemy_traspass");
        bottom.setOrigin(0);
        bottom.setScale(GameConstants.GAME_WIDTH / left.width, -.5);
        this.add(bottom);

        let duration = GameVars.timeStepFactor === 1 ? 800 : 200;

        if (BattleManager.engine.noEnemiesOnStage) {
            duration *= 4;
        }

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.In,
            duration: duration,
            onComplete: function(): void {
                this.destroy();
            },
            onCompleteScope: this
        });
    }
}
