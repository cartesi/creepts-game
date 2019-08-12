import { GameManager } from "../GameManager";
import { AudioManager } from "../AudioManager";

export class PreloadScene extends Phaser.Scene {

    public static currentInstance: PreloadScene;

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

        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Light", fontSize: 28, color: "#A6F834" });
        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Regular", fontSize: 28, color: "#A6F834" });
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "assets/texture_atlas_1.png", "assets/texture_atlas_1.json");
        this.load.json("audiosprite", "assets/audio/audiosprite.json");
    }

    private loadHowl(): void {

        let json = this.cache.json.get("audiosprite");
        json = JSON.parse(JSON.stringify(json).replace("urls", "src"));

        AudioManager.sound = new Howl(json);
    
        AudioManager.sound.on("load", function() {

            console.log("Howl audio loaded.");
            GameManager.setCurrentScene(PreloadScene.currentInstance);
            PreloadScene.currentInstance.scene.setVisible(false);
            GameManager.onGameAssetsLoaded();
        });
    }
}
