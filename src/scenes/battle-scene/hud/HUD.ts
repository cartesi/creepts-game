import { BattleManager } from "../BattleManager";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;

    private creditsLabel: Phaser.GameObjects.Text;
    private lifesLabel: Phaser.GameObjects.Text;
    private roundLabel: Phaser.GameObjects.Text;

    private enemyIcon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {

        super(scene);

        // this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleY;
        
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

        this.creditsLabel = new Phaser.GameObjects.Text(this.scene, 35, 5, GameVars.formatNumber(BattleManager.anutoEngine.credits), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.add(this.creditsLabel);

        let lifesIcon = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH / 2 - 2, 8, "texture_atlas_1", "lives_icon");
        lifesIcon.setOrigin(1, 0);
        lifesIcon.setScale(.9);
        this.add(lifesIcon);

        this.lifesLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH / 2 + 2, 5, BattleManager.anutoEngine.lifes.toString(), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.add(this.lifesLabel);

        this.roundLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH - 5, 5, "Round " + GameVars.formatNumber(BattleManager.anutoEngine.round), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.roundLabel.setOrigin(1, 0);
        this.add(this.roundLabel);

        this.enemyIcon = new Phaser.GameObjects.Image(this.scene, this.roundLabel.x - this.roundLabel.width - 2, 5, "texture_atlas_1", "enemy_icon");
        this.enemyIcon.setOrigin(1, 0);
        this.enemyIcon.setScale(.9);
        this.add(this.enemyIcon);

        if (GameConstants.DEVELOPMENT) {
            this.ticksLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT - 5, "ticks: " + BattleManager.anutoEngine.ticksCounter, {fontFamily: "Rubik-Regular", fontSize: "25px", color: "#000000"});
            this.ticksLabel.setOrigin(.5, 1);
            this.add(this.ticksLabel);
        } else {
            this.ticksLabel = null;
        }
    }

    public update(time: number, delta: number): void {

        this.creditsLabel.text = GameVars.formatNumber(BattleManager.anutoEngine.credits);

        if (this.ticksLabel && !BattleManager.anutoEngine.gameOver) {
            this.ticksLabel.text = "ticks: " + BattleManager.anutoEngine.ticksCounter;
        }
    }

    public updateLifes(): void {

        this.lifesLabel.setText(BattleManager.anutoEngine.lifes < 0 ? "0" : BattleManager.anutoEngine.lifes.toString());
    }

    public updateRound(): void {

        this.roundLabel.setText("Round " + BattleManager.anutoEngine.round);
        this.enemyIcon.x = this.roundLabel.x - this.roundLabel.width - 2;
    }

    public onWaveOver(): void {
        //
    }
}