// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { AudioManager } from "./AudioManager";
import { GameVars } from "./GameVars";

export class Game extends Phaser.Game {

    public static currentInstance: Phaser.Game;

    constructor(config: Phaser.Types.Core.GameConfig) {
        
        super(config);
      
        Game.currentInstance = this;

        this.onBlur = () => {
            if (AudioManager.sound) {
                AudioManager.sound.mute(true);
            }

            if (AudioManager.music) {
                AudioManager.music.mute(true);
            }
        };

        this.onFocus = () => {
            if (AudioManager.sound) {
                AudioManager.sound.mute(GameVars.gameData.soundMuted);
            }

            if (AudioManager.music) {
                AudioManager.music.mute(GameVars.gameData.musicMuted);
            }
        };
    }
}
