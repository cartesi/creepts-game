declare interface GameData {
    muted: boolean,
}

declare interface LogsObject {
    gameConfig: Anuto.Types.GameConfig;
    enemiesData: any;
    turretsData: any;
    wavesData: any;
    actions: Action[];
}

declare interface Action {
    type: string;
    tick: number;
    turretType?: string;
    id?: number;
    position?: any;
}
