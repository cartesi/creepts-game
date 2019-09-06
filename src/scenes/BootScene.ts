import { GameVars } from "../GameVars";
import { GameManager } from "../GameManager"; 

export class BootScene extends Phaser.Scene {

    public static currentInstance: BootScene;
    
    constructor() {

        super("BootScene");
    }

    public create(data: any): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Light", fontSize: 28, color: "#A6F834" });
        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Regular", fontSize: 28, color: "#A6F834" });

        BootScene.currentInstance = this;
        GameManager.setCurrentScene(this);

        this.scene.setVisible(false);

        GameManager.init(data);
    }
}
