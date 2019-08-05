import { BattleManager } from "../BattleManager";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;
    private creditsLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0xFFFFFF);
        bck.fillRect(0, 0, GameConstants.GAME_WIDTH, 122);
        this.add(bck);

        this.creditsLabel = new Phaser.GameObjects.Text(this.scene, 10, 10, "Credits: " + BattleManager.anutoEngine.credits, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.add(this.creditsLabel);

        if (GameConstants.DEVELOPMENT) {
            this.ticksLabel = new Phaser.GameObjects.Text(this.scene, 15, GameConstants.GAME_HEIGHT - 35, "ticks: " + BattleManager.anutoEngine.ticksCounter, {fontFamily: "Rubik-Regular", fontSize: "25px", color: "#000000"});
            this.add(this.ticksLabel);
        } else {
            this.ticksLabel = null;
        }
    }

    public update(time: number, delta: number): void {

        this.creditsLabel.text = "Credits: " + BattleManager.anutoEngine.credits;

        if (this.ticksLabel) {
            this.ticksLabel.text = "ticks: " + BattleManager.anutoEngine.ticksCounter;
        }
    }

    public onWaveOver(): void {
        //
    }
}
