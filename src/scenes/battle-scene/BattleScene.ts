import { BoardContainer } from "./BoardContainer";
import { GUI } from "./gui/GUI";
import { HUD } from "./hud/HUD";
import { BattleManager } from "./BattleManager";
import { GameVars } from "../../GameVars";

export class BattleScene extends Phaser.Scene {

    public static currentInstance: BattleScene;
    
    public hud: HUD;
    public gui: GUI;
    public boardContainer: BoardContainer;

    constructor() {

        super("BattleScene");
        BattleScene.currentInstance = this;
    }

    public create(data: any): void {
        GameVars.currentScene = this;

        this.cameras.main.setBackgroundColor(0xCCCCCC);

        const map: MapObject = GameVars.mapsData[data.mapIndex];
        BattleManager.init(map);

        this.boardContainer = new BoardContainer(this, map);
        this.add.existing(this.boardContainer);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this, map);
        this.add.existing(this.gui);

        // this.boardContainer.addInitialTowers();
    }

    public update(time: number, delta: number): void {

        BattleManager.update(time, delta);

        this.boardContainer.update(time, delta);
        this.hud.update(time, delta);
    }

    public onWaveOver(): void {

        this.hud.onWaveOver();
    }

    public createTurret(type: string): void {

        this.gui.createTurret(type);
        this.boardContainer.hideTurretMenu();
        this.boardContainer.hideRangeCircles();
    }

    public updateTurretButtons(): void {

        this.gui.updateTurretButtons();
        this.boardContainer.updateTurretMenu();
    }
}
