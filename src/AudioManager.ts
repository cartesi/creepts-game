import "howler";
import { GameVars } from "./GameVars";
import { GameManager } from "./GameManager";

// audiosprite --e "mp3,ogg" --o ../../assets/audio/sound *.mp3 --f howler
// audiosprite --e "mp3,ogg" --o ../../assets/audio/music *.mp3 --f howler
export class AudioManager {

    public static sound: Howl;
    public static music: Howl;

    private static backgroundKeyMusic: string;
    private static backgroundIdMusic: number;

    public static init(): void {

        AudioManager.sound.mute(GameVars.gameData.soundMuted);
        AudioManager.music.mute(GameVars.gameData.musicMuted);
    }

    public static toggleSoundState(): void {

        GameVars.gameData.soundMuted = !GameVars.gameData.soundMuted;
        GameManager.writeGameData();
        AudioManager.sound.mute(GameVars.gameData.soundMuted);
    }

    public static toggleMusicState(): void {

        GameVars.gameData.musicMuted = !GameVars.gameData.musicMuted;
        GameManager.writeGameData();
        AudioManager.music.mute(GameVars.gameData.musicMuted);
    }

    public static playSound(key: string, loop?: boolean, volume?: number): void {

        loop = loop || false;
        volume = volume || 1;

        let id = AudioManager.sound.play(key);
        AudioManager.sound.loop(loop, id);
        AudioManager.sound.volume(volume, id);
    }

    public static playMusic(key: string, volume?: number): void {

        if (AudioManager.backgroundKeyMusic === key) {
            return;
        }

        volume = volume || 1;

        AudioManager.backgroundIdMusic = AudioManager.music.play(key);
        AudioManager.music.loop(true, AudioManager.backgroundIdMusic);
        AudioManager.music.volume(volume, AudioManager.backgroundIdMusic);
    }

    public static setMusicRate(rate: number): void {

        AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
    }
}
