declare interface GameData {
    muted: boolean,
}

declare interface LogsObject {
    actions: Action[];
}

declare interface LevelObject {
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
