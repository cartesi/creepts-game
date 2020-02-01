// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


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

        AudioManager.music.on("fade", () => {
            // 
        });
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

    public static playSound(key: string, loop?: boolean, volume?: number, rate?: number): void {

        loop = loop || false;
        volume = volume || 1;
        rate = rate || 1;

        let id = AudioManager.sound.play(key);
        AudioManager.sound.loop(loop, id);
        AudioManager.sound.rate(rate, id);
        AudioManager.sound.volume(volume, id);
    }

    public static playMusic(key: string, rate?: number, volume?: number): void {

        if (AudioManager.backgroundKeyMusic === key) {
            AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
            AudioManager.music.volume(volume || 1, AudioManager.backgroundIdMusic);
            return;
        }

        AudioManager.backgroundKeyMusic = key;
        rate = rate || 1;
        volume = volume || 1;

        AudioManager.music.fade(1, 0, 500, AudioManager.backgroundIdMusic);

        AudioManager.backgroundIdMusic = AudioManager.music.play(key);
        AudioManager.music.fade(0, volume, 500, AudioManager.backgroundIdMusic);
        AudioManager.music.loop(true, AudioManager.backgroundIdMusic);
        AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
    }

    public static stopMusic(): void {

        AudioManager.music.fade(AudioManager.music.volume(AudioManager.backgroundIdMusic) as number, 0, 500, AudioManager.backgroundIdMusic);
    }

    public static setMusicRate(rate: number): void {

        AudioManager.music.rate(rate, AudioManager.backgroundIdMusic);
    }

    public static setMusicVolume(volume: number): void {

        AudioManager.music.volume(volume, AudioManager.backgroundIdMusic);
    }
}
