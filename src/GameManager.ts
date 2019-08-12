import { GameConstants } from "./GameConstants";
import { GameVars } from "./GameVars";
import { AudioManager } from "./AudioManager";

export class GameManager {

    public static init(): void {  

        if (GameVars.currentScene.sys.game.device.os.desktop) {
            GameVars.scaleY = 1;
            GameVars.scaleCorrectionFactor = 1;
        } else {

            GameVars.currentScene.game.scale.displaySize = GameVars.currentScene.game.scale.parentSize;
            GameVars.currentScene.game.scale.refresh();

            const aspectRatio = window.innerHeight / window.innerWidth;
            GameVars.scaleY = (GameConstants.GAME_HEIGHT / GameConstants.GAME_WIDTH) / aspectRatio;

            if (aspectRatio > 1.5) {
                GameVars.scaleCorrectionFactor = 1.2;
            } else if (aspectRatio < 1.33) {
                GameVars.scaleCorrectionFactor = .8;
            } else {
                GameVars.scaleCorrectionFactor = 1;
            }
        }

        GameManager.readGameData();
    }

    public static readGameData(): void {

        GameManager.getGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            function (gameData: string): void {

                if (gameData) {
                    GameVars.gameData = JSON.parse(gameData);
                } else {
                    GameVars.gameData = {
                        muted: false,
                    };
                }

                GameManager.startGame();
            }
        );
    }

    public static setCurrentScene(scene: Phaser.Scene): void {

        GameVars.currentScene = scene;
    }

    public static onGameAssetsLoaded(): void {

        AudioManager.init();

        GameManager.enterBattleScene();
    }

    public static enterBattleScene(): void {

        GameVars.currentScene.scene.start("BattleScene");
    }

    public static reset(): void {

        GameManager.enterBattleScene();
    }

    public static writeGameData(): void {

        GameManager.setGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            GameVars.gameData,
            function (): void {
                GameManager.log("game data successfully saved");
            }
        );
    }

    public static log(text: string, error?: Error): void {

        if (!GameConstants.VERBOSE) {
            return;
        }

        if (error) {
            console.error(text + ":", error);
        } else {
            console.log(text);
        }
    }

    private static startGame(): void {

        GameVars.currentScene.scene.start("PreloadScene");
    }

    private static getGameStorageData(key: string, successCb: Function): void {

        const gameDataStr = localStorage.getItem(key);
        successCb(gameDataStr);
    }

    private static setGameStorageData(key: string, value: any, successCb: Function): void {

        localStorage.setItem(key, JSON.stringify(value));
        successCb();
    }
}
