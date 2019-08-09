import { BattleScene } from "./BattleScene";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

import enemiesData from "../../../assets/config/enemies.json";
import turretsData from "../../../assets/config/turrets.json";
import wavesData from "../../../assets/config/waves.json";
import { BoardContainer } from "./BoardContainer";

export class BattleManager {

    public static anutoEngine: Anuto.Engine;

    public static init(): void {  

        GameVars.enemiesPathCells = GameConstants.ENEMY_PATH_1;

        const gameConfig: Anuto.Types.GameConfig = {
            timeStep: GameConstants.TIME_STEP,
            runningInClientSide: true,
            enemySpawningDeltaTicks: GameConstants.ENEMY_SPAWNING_DELTA_TICKS,
            credits: GameConstants.INITIAL_CREDITS,
            lifes: GameConstants.INITIAL_LIFES,
            boardSize: GameConstants.BOARD_SIZE,
            enemiesPathCells : GameVars.enemiesPathCells
        };

        GameVars.enemiesData = enemiesData.enemies;
        GameVars.turretsData = turretsData.turrets;
        GameVars.wavesData = wavesData.waves;

        GameVars.timeStepFactor = 1;
        GameVars.paused = false;

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig, GameVars.enemiesData, GameVars.turretsData);
        
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_REACHED_EXIT, BattleManager.onEnemyReachedExit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.BULLET_SHOT, BattleManager.onBulletShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_BULLET_SHOT, BattleManager.onGlueBulletShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_HIT, BattleManager.onEnemyHit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_GLUE_HIT, BattleManager.onEnemyGlueHit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_KILLED, BattleManager.onEnemyKilled, BattleManager);
        
        BattleManager.anutoEngine.addEventListener(Anuto.Event.LASER_SHOT, BattleManager.onLaserBeamShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.MORTAR_SHOT, BattleManager.onMortarShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_SHOT, BattleManager.onGlueShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_CONSUMED, BattleManager.onGlueConsumed, BattleManager);

        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMIES_TELEPORTED, BattleManager.onEnemiesTeleported, BattleManager);
        
        BattleManager.anutoEngine.addEventListener(Anuto.Event.NO_ENEMIES_ON_STAGE, BattleManager.onNoEnemiesOnStage, BattleManager);
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
        
        // TODO: ver como se gestiona esto despues
        GameVars.currentWave = 1;

        const waveConfig: Anuto.Types.WaveConfig = {
            level: 0,
            turrets: [],
            enemies: GameVars.wavesData["wave_4"]
        };

        BattleManager.anutoEngine.newWave(waveConfig);
    }

    public static createTurret(type: string): void {

        BattleScene.currentInstance.createTurret(type);
    }

    public static addTurretToScene(type: string, position: {r: number, c: number}): void {

        BoardContainer.currentInstance.addTurret(type, position);
    }

    public static addTurret(type: string, position: {r: number, c: number}): Anuto.Turret {

        return BattleManager.anutoEngine.addTurret(type, position);
    }

    public static sellTurret(anutoTurret: Anuto.Turret): void {

        BattleManager.anutoEngine.sellTurret(anutoTurret);
        BoardContainer.currentInstance.removeTurret(anutoTurret);
        BattleScene.currentInstance.gui.updateTurretButtons();
    }

    public static onClickMenu(): void {

        BoardContainer.currentInstance.showPauseMenu();
    }

    public static improveTurret(id: number): void {

        BattleManager.anutoEngine.improveTurret(id);
        BattleScene.currentInstance.gui.updateTurretButtons();
    }

    public static upgradeTower(id: number): void {
        
        // hay creditos suficientes ?
        const sucess = BattleManager.anutoEngine.upgradeTurret(id);

        if (sucess) {
            BoardContainer.currentInstance.upgradeTurret(id);
            BattleScene.currentInstance.gui.updateTurretButtons();
        }
    }

    public static setNextStrategy(id: number): void {

        BattleManager.anutoEngine.setNextStrategy(id);
    }

    public static setFixedTarget(id: number): void {

        BattleManager.anutoEngine.setFixedTarget(id);
    }

    public static createRangeCircle(range: number, x: number, y: number): Phaser.GameObjects.Graphics {

        return BoardContainer.currentInstance.createRangeCircle(range, x, y);
    }

    public static hideRangeCircles(): void {

        BoardContainer.currentInstance.hideRangeCircles();
    }

    public static showTurretMenu(anutoTurret: Anuto.Turret): void {

        BoardContainer.currentInstance.showTurretMenu(anutoTurret);
    }

    private static onEnemySpawned(anutoEnemy: Anuto.Enemy, p: {r: number, c: number} ): void {
        
        BoardContainer.currentInstance.addEnemy(anutoEnemy, p);
    }

    private static onEnemyReachedExit(anutoEnemy: Anuto.Enemy): void {

        BoardContainer.currentInstance.removeEnemy(anutoEnemy.id);
    }

    private static onBulletShot(anutoBullet: Anuto.Bullet, anutoProjectileTurret: Anuto.ProjectileTurret): void {

        BoardContainer.currentInstance.addBullet(anutoBullet, anutoProjectileTurret);
    }

    private static onGlueBulletShot(anutoBullet: Anuto.GlueBullet, anutoGlueTurret: Anuto.GlueTurret): void {

        BoardContainer.currentInstance.addGlueBullet(anutoBullet, anutoGlueTurret);
    }

    private static onLaserBeamShot(anutoLaserTurret: Anuto.LaserTurret, anutoEnemies: Anuto.Enemy[]): void {

        BoardContainer.currentInstance.addLaserBeam(anutoLaserTurret, anutoEnemies);
    }

    private static onMortarShot(anutoMortar: Anuto.Mortar, anutoLaunchTurret: Anuto.LaunchTurret): void {

        BoardContainer.currentInstance.addMortar(anutoMortar, anutoLaunchTurret);
    }

    private static onGlueShot(anutoGlue: Anuto.Glue, anutoGlueTurret: Anuto.GlueTurret): void {

        BoardContainer.currentInstance.addGlue(anutoGlue, anutoGlueTurret);
    }

    private static onGlueConsumed(anutoGlue: Anuto.Glue): void {

        BoardContainer.currentInstance.onGlueConsumed(anutoGlue);
    }

    private static onEnemyHit(anutoEnemies: Anuto.Enemy[], anutoBullet?: Anuto.Bullet, anutoMortar?: Anuto.Mortar): void {

        for (let i = 0; i < anutoEnemies.length; i ++) {
            BoardContainer.currentInstance.onEnemyHit(anutoEnemies[i]);
        }
        
        if (anutoBullet) {
            BoardContainer.currentInstance.removeBullet(anutoBullet);
        } 

        if (anutoMortar) {
            BoardContainer.currentInstance.detonateMortar(anutoMortar);
        }
    }

    private static onEnemyGlueHit(anutoEnemies: Anuto.Enemy[], anutoGlueBullet: Anuto.GlueBullet): void {

        for (let i = 0; i < anutoEnemies.length; i ++) {
            BoardContainer.currentInstance.onEnemyGlueHit(anutoEnemies[i]);
        }

        if (anutoGlueBullet) {
            BoardContainer.currentInstance.removeGlueBullet(anutoGlueBullet);
        } 
    }

    private static onEnemiesTeleported(teleportedEnemiesData: {enemy: Anuto.Enemy, glueTurret: Anuto.GlueTurret} []): void {

        for (let i = 0; i < teleportedEnemiesData.length; i++) {
            BoardContainer.currentInstance.teleportEnemy(teleportedEnemiesData[i].enemy, teleportedEnemiesData[i].glueTurret);
        }
    }

    private static onEnemyKilled(anutoEnemy: Anuto.Enemy): void {

        BoardContainer.currentInstance.onEnemyKilled(anutoEnemy);
    }

    private static onNoEnemiesOnStage(): void {
        // no quedan enemigos pq han sido liquidados o han llegado todos a la salida
        console.log("NO ENEMIES ON STAGE");
    }

    private static onWaveOver(): void {
        // no quedan ni enemigos ni ningún tipo de proyectil
        console.log("WAVE OVER");
    }
}
