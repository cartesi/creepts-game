declare var getKaiAd: any;

declare interface GameData {
    muted: boolean,
}

declare interface CellData {
    x: number,
    y: number,
    isMine: boolean,
    numAdjacentMines: number,
    state: number,
    flag: number
}