import { GameVars } from "../GameVars";
import { GameManager } from "../GameManager"; 

export class BootScene extends Phaser.Scene {

    public static currentInstance: BootScene;
    
    constructor() {

        super("BootScene");
    }

    public create(): void {

        BootScene.currentInstance = this;
        GameManager.setCurrentScene(this);

        GameVars.scaleY = 1;

        GameManager.init();
       
    }
}
