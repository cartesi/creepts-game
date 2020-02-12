// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import * as Creepts from "@cartesi/creepts-engine";
import { loadEnemies, loadTurrets, loadWaves } from '@cartesi/creepts-mappack';
import { LogScene } from "./../log-scene/LogScene";
import { BattleScene } from "./BattleScene";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BoardContainer } from "./BoardContainer";
import { GameManager } from "../../GameManager";
import { AudioManager } from "../../AudioManager";
import { saveAs } from "file-saver";

export class BattleManager {

    public static engine: Creepts.Engine;

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

        let gameConfig: Creepts.GameConfig;

        if (GameVars.currentScene === BattleScene.currentInstance) {
            GameVars.enemiesPathCells = GameVars.currentMapData.path;
            GameVars.plateausCells = GameVars.currentMapData.plateaus;

            GameVars.enemiesData = loadEnemies();
            GameVars.turretsData = loadTurrets();
            GameVars.wavesData = loadWaves();

            gameConfig = {
                timeStep: GameConstants.TIME_STEP,
                runningInClientSide: true,
                enemySpawningDeltaTicks: Creepts.GameConstants.ENEMY_SPAWNING_DELTA_TICKS,
                credits: Creepts.GameConstants.INITIAL_CREDITS,
                lifes: Creepts.GameConstants.INITIAL_LIFES,
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
        GameVars.waveOver = true;
        GameVars.autoSendWave = false;
        GameVars.loopNumber = 1;
        GameVars.loopRate = 1;
        GameVars.loopVolume = .2;
        GameVars.dangerRate = 1;

        BattleManager.engine = new Creepts.Engine(gameConfig, GameVars.enemiesData, GameVars.turretsData, GameVars.wavesData);

        BattleManager.setTimeStepFactor(GameVars.timeStepFactor);

        if (GameVars.currentScene === BattleScene.currentInstance) {
            GameVars.levelObject = {
                engineVersion: BattleManager.engine.version,
                gameConfig: gameConfig,
                enemiesData: GameVars.enemiesData,
                turretsData: GameVars.turretsData,
                wavesData: GameVars.wavesData
            };
        }
        
        BattleManager.engine.addEventListener(Creepts.Event.ENEMY_SPAWNED, BattleManager.onEnemySpawned, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ENEMY_REACHED_EXIT, BattleManager.onEnemyReachedExit, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.BULLET_SHOT, BattleManager.onBulletShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.GLUE_BULLET_SHOT, BattleManager.onGlueBulletShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ENEMY_HIT, BattleManager.onEnemyHit, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.REMOVE_BULLET, BattleManager.removeBullet, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.REMOVE_GLUE_BULLET, BattleManager.removeGlueBullet, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ENEMY_GLUE_HIT, BattleManager.onEnemyGlueHit, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ENEMY_KILLED, BattleManager.onEnemyKilled, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.LASER_SHOT, BattleManager.onLaserBeamShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.MORTAR_SHOT, BattleManager.onMortarShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.GLUE_SHOT, BattleManager.onGlueShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.MINE_SHOT, BattleManager.onMineShot, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.GLUE_CONSUMED, BattleManager.onGlueConsumed, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ENEMIES_TELEPORTED, BattleManager.onEnemiesTeleported, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.NO_ENEMIES_ON_STAGE, BattleManager.onNoEnemiesOnStage, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.WAVE_OVER, BattleManager.onWaveOver, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.GAME_OVER, BattleManager.onGameOver, BattleManager);
        BattleManager.engine.addEventListener(Creepts.Event.ACTIVE_NEXT_WAVE, BattleManager.activeNextWave, BattleManager);
        
        GameManager.events.emit("ready");
    }

    public static update(time: number, delta: number): void {

        BattleManager.engine.update();
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

        BattleManager.engine.timeStep = GameConstants.TIME_STEP / timeStepFactor;
    }

    public static newWave(): void {

        if (BattleManager.engine.newWave()) {

            GameVars.waveOver = false;

            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.hud.updateRound();
            } else {
                LogScene.currentInstance.hud.updateRound();
            }

            const action = {type: Creepts.GameConstants.ACTION_TYPE_NEXT_WAVE, tick: BattleManager.engine.ticksCounter};
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

    public static addTurret(type: string, position: {r: number, c: number}): Creepts.Turret {

        let data = BattleManager.engine.addTurret(type, position);

        if (data.turret) {
            let action = {type: Creepts.GameConstants.ACTION_TYPE_ADD_TURRET, tick: BattleManager.engine.ticksCounter, turretType: data.turret.type, position: position};
            BattleManager.addAction(action);
        }

        return data.turret;
    }

    public static sellTurret(id: number): void {

        if (BattleManager.engine.sellTurret(id).success) {

            let action = {type: Creepts.GameConstants.ACTION_TYPE_SELL_TURRET, tick: BattleManager.engine.ticksCounter, id: id};
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

        const success = BattleManager.engine.improveTurret(id).success;

        if (success) {
            let action = {type: Creepts.GameConstants.ACTION_TYPE_LEVEL_UP_TURRET, tick: BattleManager.engine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.improveTurret(id);
        }
    }

    public static upgradeTower(id: number): void {
        
        const success = BattleManager.engine.upgradeTurret(id).success;

        if (success) {

            let action = {type: Creepts.GameConstants.ACTION_TYPE_UPGRADE_TURRET, tick: BattleManager.engine.ticksCounter, id: id};
            BattleManager.addAction(action);

            BoardContainer.currentInstance.upgradeTurret(id);
            
            if (GameVars.currentScene === BattleScene.currentInstance) {
                BattleScene.currentInstance.updateTurretMenu();
            }
        }
    }

    public static setNextStrategy(id: number): void {

        if (BattleManager.engine.setNextStrategy(id).success) {
            let action = {type: Creepts.GameConstants.ACTION_TYPE_CHANGE_STRATEGY_TURRET, tick: BattleManager.engine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
    }

    public static setFixedTarget(id: number): void {

        if (BattleManager.engine.setFixedTarget(id).success) {
            let action = {type: Creepts.GameConstants.ACTION_TYPE_CHANGE_FIXED_TARGET_TURRET, tick: BattleManager.engine.ticksCounter, id: id};
            BattleManager.addAction(action);
        }
    }

    public static createRangeCircle(range: number, x: number, y: number, type: string): Phaser.GameObjects.Image {

        return BoardContainer.currentInstance.createRangeCircle(range, x, y, type);
    }

    public static hideRangeCircles(): void {

        BoardContainer.currentInstance.hideRangeCircles();
    }

    public static showTurretMenu(turret: Creepts.Turret): void {

        BoardContainer.currentInstance.showTurretMenu(turret);
    }

    public static hideTurretMenu(): void {

        BoardContainer.currentInstance.hideTurretMenu();
    }

    private static addAction(action): void {

        GameVars.logsObject.actions.push(action);
    }

    private static onEnemySpawned(enemy: Creepts.Enemy, p: {r: number, c: number} ): void {
        
        BoardContainer.currentInstance.addEnemy(enemy, p);
    }

    private static onEnemyReachedExit(enemy: Creepts.Enemy): void {

        BoardContainer.currentInstance.removeEnemy(enemy.id);

        if (!BattleManager.engine.gameOver) {
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

    private static onBulletShot(bullet: Creepts.Bullet, projectileTurret: Creepts.ProjectileTurret): void {

        BoardContainer.currentInstance.addBullet(bullet, projectileTurret);
    }

    private static onGlueBulletShot(bullet: Creepts.GlueBullet, turret: Creepts.GlueTurret): void {

        BoardContainer.currentInstance.addGlueBullet(bullet, turret);
    }

    private static onLaserBeamShot(laserTurret: Creepts.LaserTurret, enemies: Creepts.Enemy[]): void {

        BoardContainer.currentInstance.addLaserBeam(laserTurret, enemies);
    }

    private static onMortarShot(mortar: Creepts.Mortar, launchTurret: Creepts.LaunchTurret): void {

        BoardContainer.currentInstance.addMortar(mortar, launchTurret);
    }

    private static onGlueShot(glue: Creepts.Glue, turret: Creepts.GlueTurret): void {

        BoardContainer.currentInstance.addGlue(glue, turret);
    }

    private static onMineShot(mine: Creepts.Mine, launchMine: Creepts.LaunchTurret): void {

        BoardContainer.currentInstance.addMine(mine, launchMine);
    }

    private static onGlueConsumed(glue: Creepts.Glue): void {

        BoardContainer.currentInstance.onGlueConsumed(glue);
    }

    private static onEnemyHit(enemies: Creepts.Enemy[], bullet?: Creepts.Bullet, mortar?: Creepts.Mortar, mine?: Creepts.Mine): void {

        for (let i = 0; i < enemies.length; i ++) {
            BoardContainer.currentInstance.onEnemyHit(enemies[i]);
        }
        
        if (bullet) {
            BoardContainer.currentInstance.removeBullet(bullet);
        } 

        if (mortar) {
            BoardContainer.currentInstance.detonateMortar(mortar);
        }

        if (mine) {
            BoardContainer.currentInstance.detonateMine(mine);
        }
    }

    private static removeBullet(bullet?: Creepts.Bullet) {

        BoardContainer.currentInstance.removeBullet(bullet);
    }

    private static removeGlueBullet(bullet: Creepts.GlueBullet): void {
        
        BoardContainer.currentInstance.removeGlueBullet(bullet);
    }

    private static onEnemyGlueHit(enemies: Creepts.Enemy[], bullet: Creepts.GlueBullet): void {

        for (let i = 0; i < enemies.length; i ++) {
            BoardContainer.currentInstance.onEnemyGlueHit(enemies[i]);
        }

        if (bullet) {
            BoardContainer.currentInstance.removeGlueBullet(bullet);
        } 
    }

    private static onEnemiesTeleported(teleportedEnemiesData: {enemy: Creepts.Enemy, glueTurret: Creepts.GlueTurret} []): void {

        for (let i = 0; i < teleportedEnemiesData.length; i++) {
            BoardContainer.currentInstance.teleportEnemy(teleportedEnemiesData[i].enemy, teleportedEnemiesData[i].glueTurret);
        }
    }

    private static onEnemyKilled(enemy: Creepts.Enemy): void {

        BoardContainer.currentInstance.onEnemyKilled(enemy);
    }

    private static onNoEnemiesOnStage(): void {

        if (!BattleManager.engine.gameOver) {
            BoardContainer.currentInstance.showRoundCompletedLayer();
        }
    }

    private static onWaveOver(): void {
       
        if (GameVars.autoSendWave) {
            BattleScene.currentInstance.gui.onClickNextWave();
        } else {
            GameVars.waveOver = true;
        }
    }

    private static activeNextWave(): void {
        
        if (GameVars.currentScene === BattleScene.currentInstance) {
            BattleScene.currentInstance.gui.activeNextWave();
        }
    }

    private static onGameOver(): void {

        const mapIndex = GameVars.gameData.currentMapIndex;
        if (BattleManager.engine.score > GameVars.gameData.scores[mapIndex]) {
            GameVars.gameData.scores[mapIndex] = BattleManager.engine.score;
        }
        GameManager.writeGameData();
        
        BoardContainer.currentInstance.showGameOverLayer();

        GameManager.events.emit(
            "gameOver",
            GameVars.levelObject,
            GameVars.logsObject,
            BattleManager.engine.score,
            BattleManager.engine.round);

        if (GameConstants.DOWNLOAD && GameVars.currentScene === BattleScene.currentInstance) {
            const logData = JSON.stringify(GameVars.logsObject);
            const logBlob = new Blob([logData], { type: 'text/plain;charset=utf-8'});
            saveAs(logBlob, `log-${mapIndex}.json`);

            // const levelData = JSON.stringify(GameVars.levelObject);
            // const levelBlob = new Blob([levelData], { type: 'text/plain;charset=utf-8'});
            // saveAs(levelBlob, `level-${mapIndex}.json`);
        } 
    }
}
