import * as Anuto from "../engine/src";

declare interface GameData {
    soundMuted: boolean;
    musicMuted: boolean;
    scores: number[];
    currentMapIndex: number;
}

declare interface LogsObject {
    actions: Action[];
}

declare interface LevelObject {
    engineVersion: string;
    gameConfig: Anuto.Types.GameConfig;
    enemiesData: any;
    turretsData: any;
    wavesData: any;
}

declare interface Action {
    type: string;
    tick: number;
    turretType?: string;
    id?: number;
    position?: any;
}

declare interface MapObject {
    name: string;
    size: {r: number, c: number};
    path: {r: number, c: number}[];
    plateaus: {r: number, c: number}[];
}
