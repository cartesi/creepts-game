import { BattleManager } from "../BattleManager";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private ticksLabel: Phaser.GameObjects.Text;

    private creditsLabel: Phaser.GameObjects.Text;
    private bonusLabel: Phaser.GameObjects.Text;
    private lifesLabel: Phaser.GameObjects.Text;
    private roundLabel: Phaser.GameObjects.Text;

    private enemyIcon: Phaser.GameObjects.Image;
    private fpsLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        // this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleY;
        
        let bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000018);
        bck.fillRect(0, 0, GameConstants.GAME_WIDTH, 122);
        this.add(bck);

        let topContainer = new Phaser.GameObjects.Container(this.scene);
        topContainer.y = 87;
        this.add(topContainer);

        let creditIcon = new Phaser.GameObjects.Image(this.scene, 6, 7, "texture_atlas_1", "coin_icon");
        creditIcon.setOrigin(0);
        creditIcon.setScale(.9);
        topContainer.add(creditIcon);

        this.creditsLabel = new Phaser.GameObjects.Text(this.scene, 35, 5, GameVars.formatNumber(BattleManager.engine.credits), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        topContainer.add(this.creditsLabel);

        this.bonusLabel = new Phaser.GameObjects.Text(this.scene, 200, 5, "BONUS: " + GameVars.formatNumber(BattleManager.engine.bonus), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        topContainer.add(this.bonusLabel);

        let lifesIcon = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH / 2 + 180, 8, "texture_atlas_1", "lives_icon");
        lifesIcon.setOrigin(1, 0);
        lifesIcon.setScale(.9);
        topContainer.add(lifesIcon);

        this.lifesLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH / 2 + 184, 5, BattleManager.engine.lifes.toString(), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        topContainer.add(this.lifesLabel);

        this.roundLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH - 5, 5, "Round " + GameVars.formatNumber(BattleManager.engine.round), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#ffffff"});
        this.roundLabel.setOrigin(1, 0);
        topContainer.add(this.roundLabel);

        this.enemyIcon = new Phaser.GameObjects.Image(this.scene, this.roundLabel.x - this.roundLabel.width - 2, 5, "texture_atlas_1", "enemy_icon");
        this.enemyIcon.setOrigin(1, 0);
        this.enemyIcon.setScale(.9);
        topContainer.add(this.enemyIcon);

        if (GameConstants.DEVELOPMENT) {

            this.ticksLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / GameVars.scaleY - 5, "ticks: " + BattleManager.engine.ticksCounter, {fontFamily: "Rubik-Regular", fontSize: "25px", color: "#FFFFFF"});
            this.ticksLabel.setOrigin(.5, 1);
            this.add(this.ticksLabel);

            this.fpsLabel = new Phaser.GameObjects.Text(this.scene, 15, (GameConstants.GAME_HEIGHT - 30 ) / GameVars.scaleY, "", { fontFamily:  "Rubik-Regular", fontSize: "22px", color: "#FF0000"});
            this.add(this.fpsLabel);

        } else {

            this.ticksLabel = null;
            this.fpsLabel = null;
        }
    }

    public update(time: number, delta: number): void {

        this.creditsLabel.text = GameVars.formatNumber(BattleManager.engine.credits);
        this.bonusLabel.text = "BONUS: " + GameVars.formatNumber(BattleManager.engine.bonus);

        if (this.ticksLabel && !BattleManager.engine.gameOver) {
            this.ticksLabel.text = "ticks: " + BattleManager.engine.ticksCounter;
        }

        if (GameConstants.DEVELOPMENT) {
            this.fpsLabel.text = Math.round(this.scene.game.loop.actualFps).toString();
        }
    }

    public updateLifes(): void {

        this.lifesLabel.setText(BattleManager.engine.lifes < 0 ? "0" : BattleManager.engine.lifes.toString());
    }

    public updateRound(): void {

        this.roundLabel.setText("Round " + BattleManager.engine.round);
        this.enemyIcon.x = this.roundLabel.x - this.roundLabel.width - 2;
    }
}
