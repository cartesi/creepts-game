import { GUI } from "./GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";
import { BattleManager } from "./BattleManager";
import { BoardContainer } from "./BoardContainer";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;
    public boardContainer: BoardContainer;

    constructor() {

        super("BattleScene");
    }

    public create(): void {

        BattleManager.init();

        // const tmpBackground = this.add.graphics(this);
        // tmpBackground.fillStyle(0xFFFFFF);
        // tmpBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);
    }

    public update(time: number, delta: number): void {

        BattleManager.update(time, delta);

        this.boardContainer.update(time, delta);
        this.hud.update(time, delta);
    }

    public onWaveOver(): void {

        this.hud.onWaveOver();
    }
}
