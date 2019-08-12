import { GameManager } from './../../GameManager';
import { BattleManager } from './BattleManager';
import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";
import { GameVars } from '../../GameVars';

export class PauseMenu extends Phaser.GameObjects.Container {

    private restartButton: Phaser.GameObjects.Container;
    private changeMapButton: Phaser.GameObjects.Container;
    private configurationButton: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        super(scene);

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-200, -200, 400, 400);
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

        let offY = 0;

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

        this.changeMapButton = new Phaser.GameObjects.Container(this.scene);
        this.changeMapButton.setPosition(0, offY);
        this.changeMapButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.changeMapButton.on("pointerover", () => { this.onBtnOver(this.changeMapButton); });
        this.changeMapButton.on("pointerout", () => { this.onBtnOut(this.changeMapButton); });
        this.changeMapButton.on("pointerdown", () => { this.onClickChangeMap(); });
        this.changeMapButton.alpha = .5;
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

        offY += 65;

        this.configurationButton = new Phaser.GameObjects.Container(this.scene);
        this.configurationButton.setPosition(0, offY);
        this.configurationButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.configurationButton.on("pointerover", () => { this.onBtnOver(this.configurationButton); });
        this.configurationButton.on("pointerout", () => { this.onBtnOut(this.configurationButton); });
        this.configurationButton.on("pointerdown", () => { this.onClickConfiguration(); });
        this.configurationButton.alpha = .5;
        this.add(this.configurationButton);

        const configurationBck = new Phaser.GameObjects.Graphics(this.scene);
        configurationBck.fillStyle(0xFFFFFF);
        configurationBck.fillRect(-width / 2, -height / 2, width, height);
        configurationBck.lineStyle(2, 0xFFFFFF);
        configurationBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.configurationButton.add(configurationBck);

        const configurationText = new Phaser.GameObjects.Text(this.scene, 0, 0, "CONFIGURATION", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        configurationText.setOrigin(.5);
        this.configurationButton.add(configurationText);
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

        console.log(" TO DO: change map menu");
        // TODO: menu de seleccion de mapas
    }

    private onClickConfiguration(): void {

        console.log(" TO DO: configuration menu");
        // TODO: menu de configuracion
    }
}
