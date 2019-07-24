import { GameConstants } from "../../GameConstants";
import { BoardContainer } from "./BoardContainer";
import { GameVars } from "../../GameVars";

import enemyData from "../../../assets/config/enemies.json";
import turretData from "../../../assets/config/turrets.json";

export class BattleManager {

    public static anutoEngine: Anuto.Engine;

    public static init(): void {  

        GameVars.enemiesPathCells = [
            {r: -1, c: 3},
            {r: 0, c: 3},
            {r: 1, c: 3},
            {r: 1, c: 4},
            {r: 1, c: 5},
            {r: 1, c: 6},
            {r: 2, c: 6},
            {r: 3, c: 6},
            {r: 3, c: 5},
            {r: 3, c: 4},
            {r: 4, c: 4},
            {r: 5, c: 4},
            {r: 6, c: 4},
            {r: 7, c: 4},
            {r: 8, c: 4},
            {r: 9, c: 4},
            {r: 10, c: 4}
        ];

        const gameConfig: Anuto.Types.GameConfig = {
            timeStep: GameConstants.TIME_STEP,
            runningInClientSide: true,
            credits: GameConstants.INITIAL_CREDITS,
            boardSize: GameConstants.BOARD_SIZE,
            enemiesPathCells : GameVars.enemiesPathCells
        };

        GameVars.enemyData = enemyData;
        GameVars.turretData = turretData;
        GameVars.timeStepFactor = 1;
        GameVars.paused = false;

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig, GameVars.enemyData, GameVars.turretData);
        
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_REACHED_EXIT, BattleManager.onEnemyReachedExit, BattleManager);

        BattleManager.anutoEngine.addEventListener(Anuto.Event.BULLET_SHOT, BattleManager.onBulletShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_HIT, BattleManager.onEnemyHit, BattleManager);

        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_KILLED, BattleManager.onEnemyKilled, BattleManager);

        BattleManager.anutoEngine.addEventListener(Anuto.Event.WAVE_OVER, BattleManager.onWaveOver, BattleManager);
    }

    public static update(time: number, delta: number): void {

        BattleManager.anutoEngine.update();
    }

    public static pause(): void {

        GameVars.paused = true;

        this.anutoEngine.paused = true;
    }

    public static resume(): void {

        GameVars.paused = false;

        this.anutoEngine.paused = false;
    }

    public static setTimeStepFactor(timeStepFactor: number): void {

        GameVars.timeStepFactor = timeStepFactor;

        BattleManager.anutoEngine.timeStep = GameConstants.TIME_STEP / timeStepFactor;
    }

    public static newWave(): void {

        if (BattleManager.anutoEngine.waveActivated) {
            return;
        }
        
        const waveConfig: Anuto.Types.WaveConfig = {
            level: 0,
            turrets: [],
            totalEnemies: 10
        };

        BattleManager.anutoEngine.newWave(waveConfig);
    }

    public static addTurret(type, position: {r: number, c: number}): Anuto.Turret {

        return BattleManager.anutoEngine.addTurret(type, position);
    }

    private static onEnemySpawned(anutoEnemy: Anuto.Enemy, p: {r: number, c: number} ): void {
        
        BoardContainer.currentInstance.addEnemy(anutoEnemy, p);
    }

    private static onEnemyReachedExit(anutoEnemy: Anuto.Enemy): void {

        BoardContainer.currentInstance.removeEnemy(anutoEnemy.id);
    }

    private static onBulletShot(anutoBullet: Anuto.Bullet, anutoTurret: Anuto.Turret): void {

        BoardContainer.currentInstance.addBullet(anutoBullet);
    }

    private static onEnemyHit(anutoEnemy: Anuto.Enemy, anutoBullet: Anuto.Bullet): void {

        BoardContainer.currentInstance.onEnemyHit(anutoEnemy);
        
        BoardContainer.currentInstance.removeBullet(anutoBullet);
    }

    private static onEnemyKilled(anutoEnemy: Anuto.Enemy): void {

        console.log("enemy killed");

        BoardContainer.currentInstance.onEnemyKilled(anutoEnemy);
    }

    private static onWaveOver(): void {
        //
    }
}
