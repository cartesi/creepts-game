import { BattleManager } from "./BattleManager";
import { GameConstants } from "../../GameConstants";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;
    private creditsLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.creditsLabel = new Phaser.GameObjects.Text(this.scene, 15, 15, "credits: " + BattleManager.anutoEngine.credits, {fontFamily: "Arial", fontSize: "25px", color: "#000000"});
        this.add(this.creditsLabel);

        if (GameConstants.DEVELOPMENT) {
            this.ticksLabel = new Phaser.GameObjects.Text(this.scene, 15, GameConstants.GAME_HEIGHT - 35, "ticks: " + BattleManager.anutoEngine.ticksCounter, {fontFamily: "Arial", fontSize: "25px", color: "#000000"});
            this.add(this.ticksLabel);
        } else {
            this.ticksLabel = null;
        }
    }

    public update(ime: number, delta: number): void {

        this.creditsLabel.text = "credits: " + BattleManager.anutoEngine.credits;

        if (this.ticksLabel) {
            this.ticksLabel.text = "ticks: " + BattleManager.anutoEngine.ticksCounter;
        }
    }

    public onWaveOver(): void {
        //
    }
}
