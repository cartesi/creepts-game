import { BattleManager } from "./BattleManager";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.ticksLabel = new Phaser.GameObjects.Text(this.scene, 15, 15, "ticks: " + BattleManager.anutoEngine.ticksCounter, {fontFamily: "Arial", fontSize: "25px", color: "#000000"});
        this.add(this.ticksLabel);
    }

    public update(ime: number, delta: number): void {

        this.ticksLabel.text = "ticks: " + BattleManager.anutoEngine.ticksCounter;
    }

    public onWaveOver(): void {
        //
    }
}
