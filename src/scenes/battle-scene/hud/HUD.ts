import { BattleManager } from "../BattleManager";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;

    private creditsLabel: Phaser.GameObjects.Text;
    private lifesLabel: Phaser.GameObjects.Text;
    private roundLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;
        
        let bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0xFFFFFF);
        bck.fillRect(0, 0, GameConstants.GAME_WIDTH, 122);
        this.add(bck);

        bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(0, 0, GameConstants.GAME_WIDTH, 35);
        this.add(bck);

        let creditIcon = new Phaser.GameObjects.Image(this.scene, 6, 6, "texture_atlas_1", "coin_icon");
        creditIcon.setOrigin(0);
        creditIcon.setScale(.9);
        this.add(creditIcon);

        this.creditsLabel = new Phaser.GameObjects.Text(this.scene, 35, 5, BattleManager.anutoEngine.credits.toString(), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.add(this.creditsLabel);

        let lifesIcon = new Phaser.GameObjects.Image(this.scene, 130, 8, "texture_atlas_1", "lives_icon");
        lifesIcon.setOrigin(0);
        lifesIcon.setScale(.9);
        this.add(lifesIcon);

        this.lifesLabel = new Phaser.GameObjects.Text(this.scene, 158, 5, BattleManager.anutoEngine.lifes.toString(), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.add(this.lifesLabel);

        let enemyIcon = new Phaser.GameObjects.Image(this.scene, 220, 5, "texture_atlas_1", "enemy_icon");
        enemyIcon.setOrigin(0);
        enemyIcon.setScale(.9);
        this.add(enemyIcon);

        this.roundLabel = new Phaser.GameObjects.Text(this.scene, 250, 5, "Round " + BattleManager.anutoEngine.round, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.add(this.roundLabel);

        if (GameConstants.DEVELOPMENT) {
            this.ticksLabel = new Phaser.GameObjects.Text(this.scene, 15, GameConstants.GAME_HEIGHT - 35, "ticks: " + BattleManager.anutoEngine.ticksCounter, {fontFamily: "Rubik-Regular", fontSize: "25px", color: "#000000"});
            this.add(this.ticksLabel);
        } else {
            this.ticksLabel = null;
        }
    }

    public update(time: number, delta: number): void {

        this.creditsLabel.text = BattleManager.anutoEngine.credits.toString();

        if (this.ticksLabel) {
            this.ticksLabel.text = "ticks: " + BattleManager.anutoEngine.ticksCounter;
        }
    }

    public updateLifes(): void {

        this.lifesLabel.setText(BattleManager.anutoEngine.lifes.toString());
    }

    public updateRound(): void {

        this.roundLabel.setText("Round " + BattleManager.anutoEngine.round);
    }

    public onWaveOver(): void {
        //
    }
}
