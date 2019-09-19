import { GameManager } from "./../../GameManager";
import { BattleManager } from "./BattleManager";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BattleScene } from "./BattleScene";

export class GameOverLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-GameConstants.GAME_WIDTH / 2, -100, GameConstants.GAME_WIDTH, 275);
        bck.alpha = .75;
        this.add(bck);

        const titleLines = new Phaser.GameObjects.Graphics(this.scene);
        titleLines.setPosition(0, 255);
        titleLines.lineStyle(4, 0xffffff);
        titleLines.strokeRect(-180, -330, 360, 70);
        titleLines.lineStyle(2, 0xffffff);
        titleLines.strokeRect(-170, -320, 340, 50);
        this.add(titleLines);

        const title = new Phaser.GameObjects.Text(this.scene, 0, -60, "GAME OVER", {fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF"});
        title.setOrigin(.5, 0);
        this.add(title);

        const score = new Phaser.GameObjects.Text(this.scene, 0, 50, "SCORE: " + GameVars.formatNumber(BattleManager.anutoEngine.score), {fontFamily: "Rubik-Regular", fontSize: "65px", color: "#FFFFFF"});
        score.setOrigin(.5);
        this.add(score);

        const width = 350;
        const height = 40;

        const restartButton = new Phaser.GameObjects.Container(this.scene);
        restartButton.setPosition(0, 125);
        restartButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        restartButton.on("pointerover", () => { this.onBtnOver(restartButton); });
        restartButton.on("pointerout", () => { this.onBtnOut(restartButton); });
        restartButton.on("pointerdown", () => { this.onClickRestart(); });
        this.add(restartButton);

        const restartBck = new Phaser.GameObjects.Graphics(this.scene);
        restartBck.fillStyle(0xFFFFFF);
        restartBck.fillRect(-width / 2, -height / 2, width, height);
        restartBck.lineStyle(2, 0xFFFFFF);
        restartBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        restartButton.add(restartBck);

        const restartText = new Phaser.GameObjects.Text(this.scene, 0, 0, "RESTART", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        restartText.setOrigin(.5);
        restartButton.add(restartText);

        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500
        });

        if (GameVars.currentScene !== BattleScene.currentInstance) {
            restartText.setText("EXIT");
        }
    }

    private onBtnOver(btn: Phaser.GameObjects.Container): void {

        if (btn.alpha === 1) {
            btn.setScale(1.025);
        }
    }

    private onBtnOut(btn: Phaser.GameObjects.Container): void {
        
        if (btn.alpha === 1) {
            btn.setScale(1);
        }
    }

    private onClickRestart(): void {

        GameManager.reset();
    }
}
