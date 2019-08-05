import { BoardContainer } from './BoardContainer';
import { GUI } from "./gui/GUI";
import { HUD } from "./hud/HUD";
import { GameConstants } from "../../GameConstants";
import { BattleManager } from "./BattleManager";

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

        BattleManager.init();

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);
        
        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        // remove
        // this.boardContainer.initialTurrets();

        
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
        this.hideRangeCircles();
    }

    public addTurret(type, position): void {

        this.boardContainer.addTurret(type, position);
    }

    public createRangeCircle(range: number, x: number, y: number): Phaser.GameObjects.Graphics {

        return this.boardContainer.createRangeCircle(range, x, y);
    }

    public hideRangeCircles(): void {

        this.boardContainer.hideRangeCircles();
    }

    public showTurretMenu(anutoTurret: Anuto.Turret): void {

        this.boardContainer.showTurretMenu(anutoTurret);
    }
}
