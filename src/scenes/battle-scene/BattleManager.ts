import { GameConstants } from "../../GameConstants";

export class BattleManager {

    private static t: number;
    private static anutoEngine: Anuto.Engine;

    public static init(): void {  

        BattleManager.t = 0;

        const gameConfig: Anuto.Types.GameConfig = {
            timeStep: GameConstants.TIME_STEP,
            boardSize: GameConstants.BOARD_SIZE
        };

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig);

        // TODO: attach the callbacks
    }

    public static update(time: number, delta: number): void {

        BattleManager.anutoEngine.update();
    }

    public static setTimeStep(timeStep: number): void {

        BattleManager.anutoEngine.timeStep = timeStep;
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

    public static addTower(position: {r: number, c: number}): Anuto.Tower {

        return BattleManager.anutoEngine.addTower( "tower 1", position);
    }

    public static onEnemySpawned(type: string, position: {r: number, c: number}): void {
        //
    }

    public static onEnemyHit(id: number, damage: number): void {
        //
    }
}
