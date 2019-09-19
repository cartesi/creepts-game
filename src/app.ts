import "phaser";

import { Game } from "./Game";
import { GameConstants } from "./GameConstants";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { BattleScene } from "./scenes/battle-scene/BattleScene";
import { MapsScene } from "./scenes/maps-scene/MapsScene";
import { LogScene } from "./scenes/log-scene/LogScene";

let game: Game;

window.onload = () => {
    
    const gameConfig = {

        version: GameConstants.VERSION,
        type: Phaser.AUTO,
        backgroundColor: "#000000",
        scale: {
            mode: Phaser.Scale.FIT,
            parent: "content",
            width: GameConstants.GAME_WIDTH,
            height: GameConstants.GAME_HEIGHT
        },

        scene:  [
                    BootScene, 
                    PreloadScene, 
                    BattleScene,
                    MapsScene,
                    LogScene
                ]
    };

    // If compilation error here, compare Phaser definitions file of working copy (phaser.d.ts, line 48040 on 27-05-2019)
    // Also make sure to delete all *.ts files in node_modules/trailz folder
    game = new Game(gameConfig);

    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};

function resize(): void {

    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;

    const gameWidth: any = game.config.width;
    const gameHeight: any = game.config.height;

    const gameRatio = gameWidth / gameHeight;
    
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
