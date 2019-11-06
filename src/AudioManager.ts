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

    public static playMusic(key: string, rate?: number): void {

        if (AudioManager.backgroundKeyMusic === key) {
            AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
            return;
        }

        AudioManager.backgroundKeyMusic = key;
        rate = rate || 1;

        AudioManager.music.fade(1, 0, 500, AudioManager.backgroundIdMusic);

        // AudioManager.music.stop(AudioManager.backgroundIdMusic);

        AudioManager.backgroundIdMusic = AudioManager.music.play(key);
        AudioManager.music.fade(0, 1, 500, AudioManager.backgroundIdMusic);
        AudioManager.music.loop(true, AudioManager.backgroundIdMusic);
        AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
    }

    public static setMusicRate(rate: number): void {

        AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
    }
}
