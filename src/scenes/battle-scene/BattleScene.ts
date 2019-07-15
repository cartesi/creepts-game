import { GUI } from "./GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";
import { AnutoCoreEngine} from "../../AnutoCoreEngine";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;

    private t: number;

    constructor() {

        super("BattleScene");
    }

    public create(): void {

        AnutoCoreEngine.init();

        this.t = 0;

        const tmpBackground = this.add.graphics(this);
        tmpBackground.fillStyle(0xFFFFFF);
        tmpBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);
    }

    public update(time: number, delta: number): void {

        if (time - this.t > 100) {

            AnutoCoreEngine.update();

            this.t = time;

        } else {
            // move things
        } 
    }
}
