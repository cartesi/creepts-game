import { GameManager } from "../GameManager";
import { AudioManager } from "../AudioManager";
import { GameConstants } from "../GameConstants";
import { GameVars } from "../GameVars";

export class PreloadScene extends Phaser.Scene {

    public static currentInstance: PreloadScene;

    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {

        super("PreloadScene");

        PreloadScene.currentInstance = this;
    }

    public preload(): void {

        this.composeScene();

        this.loadAssets();
    }

    public create(): void {

        this.loadHowl();
    }
    
    private composeScene(): void {

        const loadingLabel = this.add.text(4, GameConstants.GAME_HEIGHT - 15, " LOADING...", {fontFamily: "Rubik-Regular", fontSize: "40px", color: "#FFFFFF"});
        loadingLabel.setOrigin(0, 1);
        loadingLabel.scaleY = GameVars.scaleY;

        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0xFFFFFF);
        this.progressBar.fillRect(0, GameConstants.GAME_HEIGHT - 10, GameConstants.GAME_WIDTH, 10);
        this.progressBar.scaleX = 0;
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "/assets/texture_atlas_1.png", "/assets/texture_atlas_1.json");
        this.load.json("sound", "/assets/audio/sound.json");
        this.load.json("music", "/assets/audio/music.json");

        this.load.on("progress", this.updateLoadedPercentage, this);
    }

    private updateLoadedPercentage(percentageLoaded: number): void {

        if (this.progressBar.scaleX < percentageLoaded) {
            this.progressBar.scaleX = percentageLoaded;
        }
    }

    private loadHowl(): void {

        let musicJson = this.cache.json.get("music");
        musicJson = JSON.parse(JSON.stringify(musicJson).replace("urls", "src"));

        AudioManager.music = new Howl(musicJson);
    
        AudioManager.music.on("load", function() {

            let soundJson = PreloadScene.currentInstance.cache.json.get("sound");
            soundJson = JSON.parse(JSON.stringify(soundJson).replace("urls", "src"));

            AudioManager.sound = new Howl(soundJson);

            AudioManager.sound.on("load", function() {
                GameManager.setCurrentScene(PreloadScene.currentInstance);
                PreloadScene.currentInstance.scene.setVisible(false);
                GameManager.onGameAssetsLoaded();
            });
        });
    }
}
