export class GameVars {

    public static scaleY: number;
    public static scaleCorrectionFactor: number;
    public static gameData: GameData;
    public static currentScene: Phaser.Scene;
    public static paused: boolean;
    public static enemiesData: any;
    public static turretsData: any;
    public static wavesData: any;
    public static mapsData: MapObject[];
    public static currentMapData: MapObject;
    public static currentWave: number;
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
