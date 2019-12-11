import { BoardContainer } from "./BoardContainer";
import { GUI } from "./gui/GUI";
import { HUD } from "./hud/HUD";
import { BattleManager } from "./BattleManager";
import { GameVars } from "../../GameVars";
import { AudioManager } from "../../AudioManager";
import { FxEnemyTraspass } from "./FxEnemyTraspass";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;
    public boardContainer: BoardContainer;

    constructor() {

        super("BattleScene");
        BattleScene.currentInstance = this;
    }

    public create(): void {

        GameVars.currentScene = this;

        this.cameras.main.setBackgroundColor(0x000018);

        BattleManager.init();

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        AudioManager.playMusic("alt_soundtrack", 1, .5);
    }

    public update(time: number, delta: number): void {

        if (!GameVars.paused && !GameVars.semipaused && !GameVars.waveOver) {
            BattleManager.update(time, delta);
            this.boardContainer.update(time, delta);
        }
        
        this.hud.update(time, delta);
    }

    public createTurret(type: string): void {

        this.gui.createTurret(type);
        this.boardContainer.hideTurretMenu();
        this.boardContainer.hideRangeCircles();
    }

    public updateTurretMenu(): void {
        this.boardContainer.updateTurretMenu();
    }

    public showFxEnemyTraspass(): void {

        let fx = new FxEnemyTraspass(this);
        this.add.existing(fx);
    }
}
