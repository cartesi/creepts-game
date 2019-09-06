import "howler";
import { GameVars } from './GameVars';
import { GameManager } from "./GameManager";

// audiosprite --e "mp3,ogg" --o ../assets/audio/audiosprite *.mp3 --f howler
export class AudioManager {

    public static sound: Howl;

    public static init(): void {

        AudioManager.sound.mute(GameVars.gameData.muted);
    }

    public static toggleAudioState(): void {

        GameVars.gameData.muted = !GameVars.gameData.muted;
        GameManager.writeGameData();
        AudioManager.sound.mute(GameVars.gameData.muted);
    }

    public static playSound(key: string, loop?: boolean, volume?: number): void {

        // loop = loop || false;
        // volume = volume || 1;

        // let id = AudioManager.sound.play(key);
        // AudioManager.sound.loop(loop, id);
        // AudioManager.sound.volume(volume, id);
    }
}
