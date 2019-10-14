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
