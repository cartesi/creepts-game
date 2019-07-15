export class GameVars {

    public static scaleY: number;
    public static gameData: GameData;
    public static currentScene: Phaser.Scene;
    public static paused: boolean;

    public static padNumberToString(numberAsString: string): string {

        let answer = numberAsString;

        if (numberAsString.length === 1) {
            answer = "000" + numberAsString;
        } else if (numberAsString.length === 2) {
            answer = "00" + numberAsString;
        } else if (numberAsString.length === 3) {
            answer = "0" + numberAsString;
        }

        return answer;
    }

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

    public static formatNumber(n: number): string {

        let ret: string;

        if (n >= 0) {
            if (n > 99) {
                ret = n.toString();
            } else if (n > 9) {
                ret = "0" + n.toString();
            } else {
                ret = "00" + n.toString();
            }
        } else {

            if (n < -9) {
                ret = "-" + Math.abs(n);
            } else {
                ret = "-0" + Math.abs(n);
            }
        }

        return ret;
    }
}
