import { GUI } from "./GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;

    private t: number;

    constructor() {

        super("BattleScene");
    }

    public create(): void {

        this.t = 0;

        Anuto.CoreEngine.init();

        const tmpBackground = this.add.graphics(this);
        tmpBackground.fillStyle(0xFFFFFF);
        tmpBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        console.log(Anuto.GameConstants.CONST1);
    }

    public update(time: number, delta: number): void {

        if (time - this.t > 100) {

            this.t = time;

            Anuto.CoreEngine.update();

        } else {
            // move things
        } 
    }
}
