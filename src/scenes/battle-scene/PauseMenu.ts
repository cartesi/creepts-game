import { AudioManager } from './../../AudioManager';
import { GameManager } from './../../GameManager';
import { BattleManager } from './BattleManager';
import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";
import { GameVars } from '../../GameVars';
import { ClientHttp2Session } from 'http2';

export class PauseMenu extends Phaser.GameObjects.Container {

    private restartButton: Phaser.GameObjects.Container;
    private changeMapButton: Phaser.GameObjects.Container;

    private soundButton: Phaser.GameObjects.Container;
    private soundText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene);

        this.y = -200;

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-200, -200, 400, 325);
        bck.alpha = .75;
        this.add(bck);

        const titleLines = new Phaser.GameObjects.Graphics(this.scene);
        titleLines.setPosition(0, 150);
        titleLines.lineStyle(4, 0xffffff);
        titleLines.strokeRect(-180, -330, 360, 70);
        titleLines.lineStyle(2, 0xffffff);
        titleLines.strokeRect(-170, -320, 340, 50);
        this.add(titleLines);

        let title = new Phaser.GameObjects.Text(this.scene, 0, -165, "PAUSE", {fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF"});
        title.setOrigin(.5, 0);
        this.add(title);

        let width = 350;
        let height = 40;

        let offY = -50;

        this.restartButton = new Phaser.GameObjects.Container(this.scene);
        this.restartButton.setPosition(0, offY);
        this.restartButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.restartButton.on("pointerover", () => { this.onBtnOver(this.restartButton); });
        this.restartButton.on("pointerout", () => { this.onBtnOut(this.restartButton); });
        this.restartButton.on("pointerdown", () => { this.onClickRestart(); });
        this.add(this.restartButton);

        const restartBck = new Phaser.GameObjects.Graphics(this.scene);
        restartBck.fillStyle(0xFFFFFF);
        restartBck.fillRect(-width / 2, -height / 2, width, height);
        restartBck.lineStyle(2, 0xFFFFFF);
        restartBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.restartButton.add(restartBck);

        const restartText = new Phaser.GameObjects.Text(this.scene, 0, 0, "RESTART", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        restartText.setOrigin(.5);
        this.restartButton.add(restartText);

        offY += 65;

        this.soundButton = new Phaser.GameObjects.Container(this.scene);
        this.soundButton.setPosition(0, offY);
        this.soundButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.soundButton.on("pointerover", () => { this.onBtnOver(this.soundButton); });
        this.soundButton.on("pointerout", () => { this.onBtnOut(this.soundButton); });
        this.soundButton.on("pointerdown", () => { this.onClickSound(); });
        this.add(this.soundButton);

        const soundBck = new Phaser.GameObjects.Graphics(this.scene);
        soundBck.fillStyle(0xFFFFFF);
        soundBck.fillRect(-width / 2, -height / 2, width, height);
        soundBck.lineStyle(2, 0xFFFFFF);
        soundBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.soundButton.add(soundBck);

        this.soundText = new Phaser.GameObjects.Text(this.scene, 0, 0, "SOUND ON", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.soundText.setOrigin(.5);
        this.soundButton.add(this.soundText);

        if (GameVars.gameData.muted) {
            this.soundText.setText("SOUND ON");
        } else {
            this.soundText.setText("SOUND OFF");
        }

        offY += 65;

        this.changeMapButton = new Phaser.GameObjects.Container(this.scene);
        this.changeMapButton.setPosition(0, offY);
        this.changeMapButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.changeMapButton.on("pointerover", () => { this.onBtnOver(this.changeMapButton); });
        this.changeMapButton.on("pointerout", () => { this.onBtnOut(this.changeMapButton); });
        this.changeMapButton.on("pointerdown", () => { this.onClickChangeMap(); });
        this.add(this.changeMapButton);

        const changeMapBck = new Phaser.GameObjects.Graphics(this.scene);
        changeMapBck.fillStyle(0xFFFFFF);
        changeMapBck.fillRect(-width / 2, -height / 2, width, height);
        changeMapBck.lineStyle(2, 0xFFFFFF);
        changeMapBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.changeMapButton.add(changeMapBck);

        const changeMapText = new Phaser.GameObjects.Text(this.scene, 0, 0, "CHANGE MAP", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        changeMapText.setOrigin(.5);
        this.changeMapButton.add(changeMapText);
        
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

    private onClickChangeMap(): void {

        GameManager.enterMapScene();
    }

    private onClickSound(): void {

        AudioManager.toggleAudioState();

        if (GameVars.gameData.muted) {
            this.soundText.setText("SOUND ON");
        } else {
            this.soundText.setText("SOUND OFF");
        }
    }
}
