import { LogScene } from "./../log-scene/LogScene";
import { BattleScene } from "./BattleScene";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BoardContainer } from "./BoardContainer";
import { GameManager } from "../../GameManager";
import enemiesData from "../../../assets/config/enemies.json";
import turretsData from "../../../assets/config/turrets.json";
import wavesData from "../../../assets/config/waves.json";
import * as Anuto from "../../../engine/src";
import { AudioManager } from "../../AudioManager";

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

        BattleManager.generateTurretsAttributes();

        if (GameVars.currentScene === BattleScene.currentInstance || !GameVars.timeStepFactor) {
            GameVars.timeStepFactor = 1;
        }
        
        GameVars.currentWave = 1;
        GameVars.paused = false;
        GameVars.semipaused = false;
        GameVars.waveOver = true;
        GameVars.autoSendWave = false;
        GameVars.loopNumber = 1;
        GameVars.loopRate = 1;
        GameVars.loopVolume = .2;
        GameVars.dangerRate = 1;

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
        
        GameManager.events.emit("ready");
    }

    public static update(time: number, delta: number): void {

        BattleManager.anutoEngine.update();
    }

    public static pause(): void {

        GameVars.paused = true;
    }

    public static resume(): void {

        GameVars.paused = false;
    }

    public static semipause(): void {

        GameVars.semipaused = true;
    }

    public static semiresume(): void {

        GameVars.semipaused = false;
    }

    public static setTimeStepFactor(timeStepFactor: number): void {

        GameVars.timeStepFactor = timeStepFactor;

        BattleManager.anutoEngine.timeStep = GameConstants.TIME_STEP / timeStepFactor;
    }

    public static newWave(): void {

        if (BattleManager.anutoEngine.newWave()) {

            GameVars.waveOver = false;

            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.hud.updateRound();
            } else {
                LogScene.currentInstance.hud.updateRound();
            }

            const action = {type: GameConstants.TYPE_NEXT_WAVE, tick: BattleManager.anutoEngine.ticksCounter};
            BattleManager.addAction(action);

            AudioManager.playMusic("alt_soundtrack", 1, GameVars.loopVolume);

            if (BattleManager.anutoEngine.round % 5 === 0) {
                AudioManager.stopMusic();
                GameVars.loopVolume = .2;
            } else {
                GameVars.loopVolume += .2;
            }

            // AudioManager.playMusic("loop_" + GameVars.loopNumber, GameVars.loopRate);

            // if (BattleManager.anutoEngine.round % 5 === 0) {
            //     if (GameVars.loopNumber < 7) {
            //         GameVars.loopNumber++;
            //     } else {
            //         GameVars.loopRate = Math.min(1.2, GameVars.loopRate + .01);
            //     }
            // }
            
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

        let data = BattleManager.anutoEngine.addTurret(type, position);

        if (data.turret) {
            let action = {type: GameConstants.TYPE_ADD_TURRET, tick: BattleManager.anutoEngine.ticksCounter, turretType: data.turret.type, position: position};
            BattleManager.addAction(action);
        }

        return data.turret;
    }

    public static sellTurret(id: number): void {

        if (BattleManager.anutoEngine.sellTurret(id).success) {

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

        const success = BattleManager.anutoEngine.improveTurret(id).success;

        if (success) {
            let action = {type: GameConstants.TYPE_LEVEL_UP_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.improveTurret(id);
        }
    }

    public static upgradeTower(id: number): void {
        
        const success = BattleManager.anutoEngine.upgradeTurret(id).success;

        if (success) {

            let action = {type: GameConstants.TYPE_UPGRADE_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.upgradeTurret(id);
            
            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.updateTurretMenu();
            }
        }
    }

    public static setNextStrategy(id: number): void {

        if (BattleManager.anutoEngine.setNextStrategy(id).success) {
            let action = {type: GameConstants.TYPE_CHANGE_STRATEGY_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
    }

    public static setFixedTarget(id: number): void {

        if (BattleManager.anutoEngine.setFixedTarget(id).success) {
            let action = {type: GameConstants.TYPE_CHANGE_FIXED_TARGET_TURRET, tick: BattleManager.anutoEngine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
    }

    public static createRangeCircle(range: number, x: number, y: number, type: string): Phaser.GameObjects.Image {

        return BoardContainer.currentInstance.createRangeCircle(range, x, y, type);
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

        if (!BattleManager.anutoEngine.gameOver) {
            AudioManager.playSound("danger", false, 1, GameVars.dangerRate);
            GameVars.dangerRate = Math.max(GameVars.dangerRate - .0125, .75);
            BattleScene.currentInstance.showFxEnemyTraspass();
        }
        

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
        } else {
            GameVars.waveOver = true;
            AudioManager.playMusic("music");
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

        GameManager.events.emit(
            "gameOver",
            GameVars.levelObject,
            GameVars.logsObject,
            BattleManager.anutoEngine.score,
            BattleManager.anutoEngine.round);

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

    private static generateTurretsAttributes(): void {

        let keys = Object.keys(GameVars.turretsData);
        for (let i = 0; i < keys.length; i++) {

            GameVars.turretsData[keys[i]].attributes = [{}, {}, {}];

            if (keys[i] === Anuto.GameConstants.TURRET_PROJECTILE) {
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 100, 140, "prev + (prev - pprev) + (i + 2) * 2", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RELOAD, 1, .95, "prev - .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RANGE, 2.5, 2.55, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 50, 60, "prev + (i + 4) * 2", 10);
                GameVars.turretsData[keys[i]].attributes[0].priceUpgrade = 5600;

                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 3400, 3560, "prev + (prev - pprev) + 64 + (i - 2) * 26", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RELOAD, .55, .5, "prev - .05", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RANGE, 3, 3.05, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 470, 658, "prev + (prev - pprev) + 75 + (i - 2) * 31", 10);
                GameVars.turretsData[keys[i]].attributes[1].priceUpgrade = 88500;

                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 20000, 20100, "prev + (i * 100)", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RELOAD, .2, .19, "prev - .01", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RANGE, 3.5, 3.55, "prev + .05", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 750, 1125, "prev + (prev - pprev) + 188 + (i - 2) * 92", 15);
            } else if (keys[i] === Anuto.GameConstants.TURRET_LAUNCH) {
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 100, 160, "prev + (prev - pprev) + (i + 4) * 2", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_EXPLOSION_RANGE, 1.5, 1.55, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RELOAD, 2, 1.95, "prev - .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RANGE, 2.5, 2.55, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 125, 150, "prev + (prev - pprev) + (i + 3)", 10);
                GameVars.turretsData[keys[i]].attributes[0].priceUpgrade = 10000;

                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 3287, 3744, "prev + (prev - pprev) + 150 + (i - 2) * 3", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_EXPLOSION_RANGE, 2, 2.05, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RELOAD, 2.55, 2.5, "prev - .05", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RANGE, 2.5, 2.5, "prev", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 750, 1050, "prev + (prev - pprev) + 120 + (i - 2) * 48", 10);
                GameVars.turretsData[keys[i]].attributes[1].priceUpgrade = 103000;

                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 48000, 48333, "prev + (prev - pprev) + 34", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_EXPLOSION_RANGE, 1.75, 1.8, "prev + .05", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RELOAD, 3, 2.95, "prev - .05", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RANGE, 3, 3.1, "prev + .1", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 950, 1425, "prev + (prev - pprev) + 238 + (i - 2) * 117", 15);
            } else if (keys[i] === Anuto.GameConstants.TURRET_LASER) {
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 230, 270, "prev + (prev - pprev) + (i + 2) * 2", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RELOAD, 1.5, 1.4, "prev - .1", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RANGE, 3, 3.05, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 50, 60, "prev + (i + 4) * 2", 10);
                GameVars.turretsData[keys[i]].attributes[0].priceUpgrade = 7000;

                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 4300, 4460, "prev + (prev - pprev) + 64 + (i - 2) * 26", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RELOAD, 1.5, 1.4, "prev - .1", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RANGE, 3, 3.05, "prev + .05", 10);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 580, 812, "prev + (prev - pprev) + 93 + (i - 2) * 37", 10);
                GameVars.turretsData[keys[i]].attributes[1].priceUpgrade = 96400;

                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_DAMAGE, 44000, 44333, "prev + (prev - pprev) + 34", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RELOAD, 3, 2.95, "prev - .05", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RANGE, 3.05, 3.1, "prev + .05", 15);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 839, 1203, "prev + (prev - pprev) + 239 + (i - 2) * 115", 15);
            } else {
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_INTENSITY, 1.2, 1.4, "prev + .2", 5);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_DURATION, 1.5, 1.5, "prev", 5);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RELOAD, 2, 2, "prev", 5);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_RANGE, 1.5, 1.6, "prev + .1", 5);
                BattleManager.setAttributes(keys[i], 1, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 100, 120, "prev + (prev - pprev) + 4 + (i - 2)", 5);
                GameVars.turretsData[keys[i]].attributes[0].priceUpgrade = 800;
                
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_INTENSITY, 1.2, 1.5, "prev + 5", 5);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_DURATION, 2.5, 2.5, "prev", 5);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RELOAD, 3, 3, "prev", 5);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_RANGE, 2.5, 2.7, "prev + .2", 5);
                BattleManager.setAttributes(keys[i], 2, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 200, 240, "prev + (prev - pprev) + (i + 2) * 2", 5);
                GameVars.turretsData[keys[i]].attributes[1].priceUpgrade = 1700;

                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_TELEPORT_DISTANCE, 15, 20, "prev + 5", 5);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RELOAD, 5, 4.5, "prev - .5", 5);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_RANGE, 3.5, 3.5, "prev", 5);
                BattleManager.setAttributes(keys[i], 3, Anuto.GameConstants.ATTRIBUTE_PRICE_IMPROVEMENT, 2000, 2400, "prev + (prev - pprev) + (i + 2) * 20", 5);
            }
        }
    }

    private static setAttributes(turret: string, grade: number , attribute: string, pprev: number, prev: number, func: string, length: number): void {

        let res = [];
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                res[i] = pprev;
            } else if (i === 1) {
                res[i] = prev;
            } else {
                pprev = res[i - 2];
                prev = res[i - 1];
                res[i] = Math.round(eval(func) * 100) / 100;
            }
        }

        GameVars.turretsData[turret].attributes[grade - 1][attribute] = res;
    }
}
