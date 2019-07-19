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
            boardSize: GameConstants.BOARD_SIZE,
            enemiesPathCells : [
                {r: 0, c: 5},
                {r: 1, c: 5},
                {r: 2, c: 5},
                {r: 3, c: 5},
                {r: 4, c: 5},
                {r: 5, c: 5},
                {r: 6, c: 5},
                {r: 7, c: 5},
                {r: 8, c: 5},
                {r: 9, c: 5}
            ]
        };

        GameVars.enemyData = enemyData;
        GameVars.towerData = towerData;
        GameVars.timeStepFactor = 1;

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig, GameVars.enemyData, GameVars.towerData);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.EVENT_ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.EVENT_ENEMY_REACHED_EXIT, BattleManager.onEnemyReachedExit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.EVENT_TIME_FACTOR_UPDATED, BattleManager.onTimeFactorUpdated, BattleManager);
    }

    public static update(time: number, delta: number): void {

        BattleManager.anutoEngine.update();
    }

    public static setTimeStepFactor(timeStepFactor: number): void {

        BattleManager.anutoEngine.timeStep = GameConstants.TIME_STEP / timeStepFactor;
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

    private static onTimeFactorUpdated(timeStep: number): void {
        
        GameVars.timeStepFactor = GameConstants.TIME_STEP / timeStep;
    }

    private static onEnemySpawned(anutoEnemy: Anuto.Enemy, p: {r: number, c: number} ): void {
        
        BoardContainer.currentInstance.addEnemy(anutoEnemy, p);
    }

    private static onEnemyReachedExit(anutoEnemy: Anuto.Enemy): void {

        BoardContainer.currentInstance.removeEnemy(anutoEnemy.id);
    }

    private static onEnemyHit(id: number, damage: number): void {
        //
    }
}
