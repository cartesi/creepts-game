// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { LevelObject, LogsObject, MapObject, WaveAttributes, EnemyAttributes, EnemyNames, TurretAttributes, TurretNames } from "@cartesi/creepts-engine";
import { GameData } from "./GameData";

export class GameVars {

    public static scaleY: number;
    public static scaleCorrectionFactor: number;
    public static gameData: GameData;
    public static currentScene: Phaser.Scene;
    public static paused: boolean;
    public static turretSelectedOn: boolean;
    public static loopNumber: number;
    public static loopRate: number;
    public static loopVolume: number;
    public static dangerRate: number;
    public static waveOver: boolean;
    public static semipaused: boolean;
    public static enemiesData: Record<EnemyNames, EnemyAttributes>;
    public static turretsData: Record<TurretNames, TurretAttributes>;
    public static wavesData: WaveAttributes[];
    public static mapsData: MapObject[];
    public static currentMapData: MapObject;
    public static currentWave: number;
    public static autoSendWave: boolean;
    public static timeStepFactor: number;
    public static enemiesPathCells: {r: number, c: number} [];
    public static plateausCells: {r: number, c: number} [];

    public static initialLogsObjects: LogsObject;
    public static logsObject: LogsObject;
    public static levelObject: LevelObject;
   
    public static formatTime(timeInSeconds: number): { str: string, h: string, m: string, s: string } {

        if (isNaN(timeInSeconds) || timeInSeconds > 24 * 3600) {
            return { str: "0:00:00", h: "00", m: "00", s: "00" };
        }

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
        const seconds = timeInSeconds - (hours * 3600) - (minutes * 60);

        let h = hours.toString();
        let m = minutes.toString();
        let s = seconds.toString();

        if (hours < 10) {
            h = "0" + hours;
        }

        if (minutes < 10) {
            m = "0" + minutes;
        }

        if (seconds < 10) {
            s = "0" + seconds;
        }

        return { str: h + ":" + m + ":" + s, h: h, m: m, s: s };
    }

    public static formatNumber(value: number): string {

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
