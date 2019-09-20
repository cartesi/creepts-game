import { LogScene } from './../log-scene/LogScene';
import { BattleScene } from "./BattleScene";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BoardContainer } from "./BoardContainer";
import { GameManager } from "../../GameManager";
import enemiesData from "../../../assets/config/enemies.json";
import turretsData from "../../../assets/config/turrets.json";
import wavesData from "../../../assets/config/waves.json";

export class BattleManager {

    public static anutoEngine: Anuto.Engine;

    public static init(): void {  

        const aspectRatio = window.innerHeight / window.innerWidth;

        if (aspectRatio > 1.5) {
            if (GameVars.currentMapData.size.c > 11) {
                GameVars.scaleCorrectionFactor = 1;
            } else if (GameVars.currentMapData.size.c > 10) {
                GameVars.scaleCorrectionFactor = 1.1;
            } else {
                GameVars.scaleCorrectionFactor = 1.2;
            }
        }

        let gameConfig: Anuto.Types.GameConfig;

        if (GameVars.currentScene === BattleScene.currentInstance) {
            GameVars.enemiesPathCells = GameVars.currentMapData.path;
            GameVars.plateausCells = GameVars.currentMapData.plateaus;

            GameVars.enemiesData = enemiesData.enemies;
            GameVars.turretsData = turretsData.turrets;
            GameVars.wavesData = wavesData.waves;

            gameConfig = {
                timeStep: GameConstants.TIME_STEP,
                runningInClientSide: true,
                enemySpawningDeltaTicks: GameConstants.ENEMY_SPAWNING_DELTA_TICKS,
                credits: GameConstants.INITIAL_CREDITS,
                lifes: GameConstants.INITIAL_LIFES,
                boardSize: GameVars.currentMapData.size,
                enemiesPathCells : GameVars.enemiesPathCells,
                plateausCells: GameVars.plateausCells
            };

            GameVars.logsObject = {
                actions: []
            };
        } else {
            GameVars.enemiesPathCells = GameVars.levelObject.gameConfig.enemiesPathCells;
            GameVars.plateausCells = GameVars.levelObject.gameConfig.plateausCells;

            GameVars.enemiesData = GameVars.levelObject.enemiesData;
            GameVars.turretsData = GameVars.levelObject.turretsData;
            GameVars.wavesData = GameVars.levelObject.wavesData;

            gameConfig = GameVars.levelObject.gameConfig;
        }

        if (GameVars.currentScene === BattleScene.currentInstance || !GameVars.timeStepFactor) {
            GameVars.timeStepFactor = 1;
        }
        
        GameVars.currentWave = 1;
        GameVars.paused = false;
        GameVars.semipaused = false;
        GameVars.autoSendWave = false;

        BattleManager.anutoEngine = new Anuto.Engine(gameConfig, GameVars.enemiesData, GameVars.turretsData, GameVars.wavesData);

        BattleManager.setTimeStepFactor(GameVars.timeStepFactor);

        if (GameVars.currentScene === BattleScene.currentInstance) {
            GameVars.levelObject = {
                engineVersion: BattleManager.anutoEngine.version,
                gameConfig: gameConfig,
                enemiesData: GameVars.enemiesData,
                turretsData: GameVars.turretsData,
                wavesData: GameVars.wavesData
            };
        }
        
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_REACHED_EXIT, BattleManager.onEnemyReachedExit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.BULLET_SHOT, BattleManager.onBulletShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_BULLET_SHOT, BattleManager.onGlueBulletShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_HIT, BattleManager.onEnemyHit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.REMOVE_BULLET, BattleManager.removeBullet, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.REMOVE_GLUE_BULLET, BattleManager.removeGlueBullet, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_GLUE_HIT, BattleManager.onEnemyGlueHit, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMY_KILLED, BattleManager.onEnemyKilled, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.LASER_SHOT, BattleManager.onLaserBeamShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.MORTAR_SHOT, BattleManager.onMortarShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_SHOT, BattleManager.onGlueShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.MINE_SHOT, BattleManager.onMineShot, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GLUE_CONSUMED, BattleManager.onGlueConsumed, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ENEMIES_TELEPORTED, BattleManager.onEnemiesTeleported, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.NO_ENEMIES_ON_STAGE, BattleManager.onNoEnemiesOnStage, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.WAVE_OVER, BattleManager.onWaveOver, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.GAME_OVER, BattleManager.onGameOver, BattleManager);
        BattleManager.anutoEngine.addEventListener(Anuto.Event.ACTIVE_NEXT_WAVE, BattleManager.activeNextWave, BattleManager);
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

        if (!GameVars.semipaused) {
            this.anutoEngine.paused = false;
        }
    }

    public static semipause(): void {

        GameVars.semipaused = true;

        this.anutoEngine.paused = true;
    }

    public static semiresume(): void {

        GameVars.semipaused = false;

        this.anutoEngine.paused = false;
    }

    public static setTimeStepFactor(timeStepFactor: number): void {

        GameVars.timeStepFactor = timeStepFactor;

        BattleManager.anutoEngine.timeStep = GameConstants.TIME_STEP / timeStepFactor;
    }

    public static newWave(): void {

        if (BattleManager.anutoEngine.newWave()) {

            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.hud.updateRound();
            } else {
                LogScene.currentInstance.hud.updateRound();
            }

            const action = {type: GameConstants.TYPE_NEXT_WAVE, tick: BattleManager.anutoEngine.ticksCounter};
            BattleManager.addAction(action);
        }
    }

    public static createTurret(type: string): void {

        if (GameVars.currentScene === BattleScene.currentInstance) {
            BattleScene.currentInstance.createTurret(type);
        }
    }

    public static addTurretToScene(type: string, position: {r: number, c: number}): void {

        BoardContainer.currentInstance.addTurret(type, position);
    }

    public static addTurret(type: string, position: {r: number, c: number}): Anuto.Turret {

        let turret = BattleManager.anutoEngine.addTurret(type, position);

        if (turret) {
            let action = {type: GameConstants.TYPE_ADD_TURRET, tick: BattleManager.anutoEngine.ticksCounter, turretType: turret.type, position: position};
            BattleManager.addAction(action);
        }

        return turret;
    }

    public static sellTurret(id: number): void {

        if (BattleManager.anutoEngine.sellTurret(id)) {

            let action = {type: GameConstants.TYPE_SELL_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.removeTurret(id);
        }
    }

    public static onClickMenu(): void {

        BoardContainer.currentInstance.showPauseMenu();
    }

    public static setAutoSendWave(value: boolean): void {

        GameVars.autoSendWave = value;
    }

    public static improveTurret(id: number): void {

        const sucess = BattleManager.anutoEngine.improveTurret(id);

        if (sucess) {
            let action = {type: GameConstants.TYPE_LEVEL_UP_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.improveTurret(id);
        }
    }

    public static upgradeTower(id: number): void {
        
        const sucess = BattleManager.anutoEngine.upgradeTurret(id);

        if (sucess) {

            let action = {type: GameConstants.TYPE_UPGRADE_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.upgradeTurret(id);
            
            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.updateTurretMenu();
            }
        }
    }

    public static setNextStrategy(id: number): void {

        if (BattleManager.anutoEngine.setNextStrategy(id)) {
            let action = {type: GameConstants.TYPE_CHANGE_STRATEGY_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
    }

    public static setFixedTarget(id: number): void {

        if (BattleManager.anutoEngine.setFixedTarget(id)) {
            let action = {type: GameConstants.TYPE_CHANGE_FIXED_TARGET_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
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

    private static addAction(action): void {

        GameVars.logsObject.actions.push(action);
    }

    private static onEnemySpawned(anutoEnemy: Anuto.Enemy, p: {r: number, c: number} ): void {
        
        BoardContainer.currentInstance.addEnemy(anutoEnemy, p);
    }

    private static onEnemyReachedExit(anutoEnemy: Anuto.Enemy): void {

        BoardContainer.currentInstance.removeEnemy(anutoEnemy.id);

        if (GameVars.currentScene === BattleScene.currentInstance) {
            BattleScene.currentInstance.hud.updateLifes();
        } else {
            LogScene.currentInstance.hud.updateLifes();
        }
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

    private static onMineShot(anutoMine: Anuto.Mine, anutoLaunchMine: Anuto.LaunchTurret): void {

        BoardContainer.currentInstance.addMine(anutoMine, anutoLaunchMine);
    }

    private static onGlueConsumed(anutoGlue: Anuto.Glue): void {

        BoardContainer.currentInstance.onGlueConsumed(anutoGlue);
    }

    private static onEnemyHit(anutoEnemies: Anuto.Enemy[], anutoBullet?: Anuto.Bullet, anutoMortar?: Anuto.Mortar, anutoMine?: Anuto.Mine): void {

        for (let i = 0; i < anutoEnemies.length; i ++) {
            BoardContainer.currentInstance.onEnemyHit(anutoEnemies[i]);
        }
        
        if (anutoBullet) {
            BoardContainer.currentInstance.removeBullet(anutoBullet);
        } 

        if (anutoMortar) {
            BoardContainer.currentInstance.detonateMortar(anutoMortar);
        }

        if (anutoMine) {
            BoardContainer.currentInstance.detonateMine(anutoMine);
        }
    }

    private static removeBullet(anutoBullet?: Anuto.Bullet) {

        BoardContainer.currentInstance.removeBullet(anutoBullet);
    }

    private static removeGlueBullet(anutoGlueBullet: Anuto.GlueBullet): void {
        
        BoardContainer.currentInstance.removeGlueBullet(anutoGlueBullet);
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

        if (!BattleManager.anutoEngine.gameOver) {
            BoardContainer.currentInstance.showRoundCompletedLayer();
        }
    }

    private static onWaveOver(): void {
       
        if (GameVars.autoSendWave) {
            BattleScene.currentInstance.gui.onClickNextWave();
        }
        
    }

    private static activeNextWave(): void {
        
        if (GameVars.currentScene === BattleScene.currentInstance) {
            BattleScene.currentInstance.gui.activeNextWave();
        }
    }

    private static onGameOver(): void {

        if (BattleManager.anutoEngine.score > GameVars.gameData.scores[GameVars.gameData.currentMapIndex]) {
            GameVars.gameData.scores[GameVars.gameData.currentMapIndex] = BattleManager.anutoEngine.score;
        }
        GameManager.writeGameData();
        
        BoardContainer.currentInstance.showGameOverLayer();

        if (GameConstants.DEVELOPMENT && GameVars.currentScene === BattleScene.currentInstance) {
            let data = JSON.stringify(GameVars.logsObject);
            let bl = new Blob([data], {
                type: "text/html"
            });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(bl);
            a.download = "log.json";
            a.hidden = true;
            document.body.appendChild(a);
            a.innerHTML = "someinnerhtml";
            a.click();

            let data2 = JSON.stringify(GameVars.levelObject);
            let bl2 = new Blob([data2], {
                type: "text/html"
            });
            let a2 = document.createElement("a");
            a2.href = URL.createObjectURL(bl2);
            a2.download = "level.json";
            a2.hidden = true;
            document.body.appendChild(a2);
            a2.innerHTML = "someinnerhtml";
            a2.click();
        } 
    }
}
