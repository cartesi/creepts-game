import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";

export class TurretMenu extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, anutoTurret: any) {

        super(scene);

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-200, -350, 400, 700);
        bck.lineStyle(4, 0x000000);
        bck.strokeRect(-200, -350, 400, 700);
        this.add(bck);

        const titleLines = new Phaser.GameObjects.Graphics(this.scene);
        titleLines.lineStyle(4, 0xffffff);
        titleLines.strokeRect(-180, -330, 360, 70);
        titleLines.lineStyle(2, 0xffffff);
        titleLines.strokeRect(-170, -320, 340, 50);
        this.add(titleLines);

        let title = new Phaser.GameObjects.Text(this.scene, 0, -315, "TOWER INFO", {fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF"});
        title.setOrigin(.5, 0);
        this.add(title);

        let offY = -230;

        let text = new Phaser.GameObjects.Text(this.scene, -180, offY, "LEVEL: " + anutoTurret.level, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        offY += 35;

        if (anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "DAMAGE: " + anutoTurret.damage, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);
        } else {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "INTENSITY: " + anutoTurret.intensity, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);

            offY += 35;

            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "DURATION: " + anutoTurret.duration, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);
        }

        offY += 35;

        if (anutoTurret.type === Anuto.GameConstants.TURRET_LAUNCH) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "EXPLOSION RANGE: " + anutoTurret.explosionRange, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);

            offY += 35;
        }

        text = new Phaser.GameObjects.Text(this.scene, -180, offY, "RELOAD: " + anutoTurret.reload, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        offY += 35;

        text = new Phaser.GameObjects.Text(this.scene, -180, offY, "RANGE: " + anutoTurret.range, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        offY += 35;

        if (anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "INFLICTED: ", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);
        }

        const strategyButton = new Button(this.scene, 0, -20, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        strategyButton.onDown(this.onClickStrategy, this);
        this.add(strategyButton);

        const objectiveButton = new Button(this.scene, 0, 40, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        objectiveButton.onDown(this.onClickObjective, this);
        this.add(objectiveButton);

        const levelButton = new Button(this.scene, 0, 120, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        levelButton.onDown(this.onClickLevel, this);
        this.add(levelButton);

        const upgradeButton = new Button(this.scene, 0, 180, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        upgradeButton.onDown(this.onClickUpgrade, this);
        this.add(upgradeButton);

        const sellButton = new Button(this.scene, 0, 240, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        sellButton.onDown(this.onClickSell, this);
        this.add(sellButton);
    }

    private onClickStrategy(): void {
        console.log("STRATEGY");
    }

    private onClickObjective(): void {
        console.log("OBJECTIVE");
    }

    private onClickLevel(): void {
        console.log("LEVEL UP");
    }

    private onClickUpgrade(): void {
        console.log("UPGRADE");
    }

    private onClickSell(): void {
        console.log("SELL");
    }
}
