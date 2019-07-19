import { GameConstants } from "../../GameConstants";
import { BoardContainer } from "./BoardContainer";
import { GameVars } from "../../GameVars";

import enemyData from "../../../assets/config/enemies.json";
import towerData from "../../../assets/config/towers.json";

export class BattleManager {

    private static anutoEngine: Anuto.Engine;

    public static init(): void {  

        const gameConfig: Anuto.Types.GameConfig = {
            timeStep: GameConstants.TIME_STEP,
            credits: GameConstants.INITIAL_CREDITS,
            boardSize: GameConstants.BOARD_SIZE
        };

        GameVars.enemyData = enemyData;
        GameVars.towerData = towerData;

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig, GameVars.enemyData, GameVars.towerData);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.EVENT_ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
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

        return BattleManager.anutoEngine.addTower("tower 1", position);
    }

    public static onEnemySpawned(anutoEnemy: Anuto.Enemy, p: {r: number, c: number} ): void {
        
        console.log("ON ENEMY SPAWNED:", anutoEnemy.id, p);
        BoardContainer.currentInstance.addEnemy(anutoEnemy, p);
    }

    public static onEnemyHit(id: number, damage: number): void {
        //
    }
}
