import { GameConstants } from "../../GameConstants";

export class BattleManager {

    private static t: number;
    private static anutoEngine: Anuto.Engine;

    public static init(): void {  

        BattleManager.t = 0;

        const gameConfig: Anuto.Types.GameConfig = {
            cellSize: GameConstants.CELLS_SIZE
        };

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig);
    }

    public static update(time: number, delta: number): void {

        if (time - BattleManager.t > 100) {

            BattleManager.t = time;

            BattleManager.anutoEngine.update();
        } 
    }

    public static newWave(): void {

        if (BattleManager.anutoEngine.waveActivated) {
            return;
        }
        
        const waveConfig: Anuto.Types.WaveConfig = {
            level: 0,
            towers: [],
            totalEnemies: 10
        };

        BattleManager.anutoEngine.newWave(waveConfig);
    }

    public static onEnemySpawned(type: string, position: {r: number, c: number}): void {
        //
    }

    public static onEnemyHit(id: number, damage: number): void {
        //
    }
}
