import { BattleManager } from './BattleManager';
import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";
import { GameVars } from '../../GameVars';

export class TurretMenu extends Phaser.GameObjects.Container {

    private strategyButton: Phaser.GameObjects.Container;
    private objectiveButton: Phaser.GameObjects.Container;
    private levelButton: Phaser.GameObjects.Container;
    private upgradeButton: Phaser.GameObjects.Container;
    private sellButton: Phaser.GameObjects.Container;

    private strategyText: Phaser.GameObjects.Text;
    private objectiveText: Phaser.GameObjects.Text;
    private levelUpText: Phaser.GameObjects.Text;
    private upgradeText: Phaser.GameObjects.Text;
    private sellText: Phaser.GameObjects.Text;

    private levelText: Phaser.GameObjects.Text;
    private damageText: Phaser.GameObjects.Text;
    private intensityText: Phaser.GameObjects.Text;
    private durationText: Phaser.GameObjects.Text;
    private distanceText: Phaser.GameObjects.Text;
    private explosionText: Phaser.GameObjects.Text;
    private reloadText: Phaser.GameObjects.Text;
    private rangeText: Phaser.GameObjects.Text;
    private inflictedText: Phaser.GameObjects.Text;

    private intensityTextAux: Phaser.GameObjects.Text;
    private durationTextAux: Phaser.GameObjects.Text;
    private distanceTextAux: Phaser.GameObjects.Text;

    private anutoTurret: Anuto.Turret;

    constructor(scene: Phaser.Scene, anutoTurret: Anuto.Turret) {

        super(scene);
        this.anutoTurret = anutoTurret;

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-200, -350, 400, 700);
        bck.alpha = .75;
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

        let text = new Phaser.GameObjects.Text(this.scene, -180, offY, "LEVEL:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        this.levelText = new Phaser.GameObjects.Text(this.scene, 50, offY, this.anutoTurret.level + "/" + this.anutoTurret.maxLevel, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(this.levelText);

        offY += 35;

        if (anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "DAMAGE:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);

            this.damageText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber(this.anutoTurret.damage), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.damageText);
        } else {
            this.intensityTextAux = new Phaser.GameObjects.Text(this.scene, -180, offY, "INTENSITY:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.intensityTextAux);

            this.intensityText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).intensity), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.intensityText);

            offY += 35;

            this.distanceTextAux = new Phaser.GameObjects.Text(this.scene, -180, offY, "DISTANCE:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.distanceTextAux);

            this.distanceText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).teleportDistance), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.distanceText);

            this.durationTextAux = new Phaser.GameObjects.Text(this.scene, -180, offY, "DURATION:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.durationTextAux);

            this.durationText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).duration), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.durationText);
        }

        offY += 35;

        if (anutoTurret.type === Anuto.GameConstants.TURRET_LAUNCH) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "EXPLOSION RANGE:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);

            this.explosionText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber((this.anutoTurret as Anuto.LaunchTurret).explosionRange), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.explosionText);

            offY += 35;
        }

        text = new Phaser.GameObjects.Text(this.scene, -180, offY, "RELOAD:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        this.reloadText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber(this.anutoTurret.reload), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(this.reloadText);

        offY += 35;

        text = new Phaser.GameObjects.Text(this.scene, -180, offY, "RANGE:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(text);

        this.rangeText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber(this.anutoTurret.range), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
        this.add(this.rangeText);

        offY += 35;

        if (anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            text = new Phaser.GameObjects.Text(this.scene, -180, offY, "INFLICTED:", {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(text);

            this.inflictedText = new Phaser.GameObjects.Text(this.scene, 50, offY, GameVars.formatNumber(this.anutoTurret.inflicted), {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#FFFFFF"});
            this.add(this.inflictedText);
        }

        // BUTTONS

        let width = 350;
        let height = 40;

        offY = 20;

        this.strategyButton = new Phaser.GameObjects.Container(this.scene);
        this.strategyButton.setPosition(0, offY);
        this.strategyButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.strategyButton.on("pointerover", () => { this.onBtnOver(this.strategyButton); });
        this.strategyButton.on("pointerout", () => { this.onBtnOut(this.strategyButton); });
        this.strategyButton.on("pointerdown", () => { this.onClickStrategy(); });
        this.add(this.strategyButton);

        const strategyBck = new Phaser.GameObjects.Graphics(this.scene);
        strategyBck.fillStyle(0xFFFFFF);
        strategyBck.fillRect(-width / 2, -height / 2, width, height);
        strategyBck.lineStyle(2, 0xFFFFFF);
        strategyBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.strategyButton.add(strategyBck);

        this.strategyText = new Phaser.GameObjects.Text(this.scene, 0, 0, "STRATEGY (" + anutoTurret.shootingStrategy + ")" , {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.strategyText.setOrigin(.5);
        this.strategyButton.add(this.strategyText);

        offY += 65;

        this.objectiveButton = new Phaser.GameObjects.Container(this.scene);
        this.objectiveButton.setPosition(0, offY);
        this.objectiveButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.objectiveButton.on("pointerover", () => { this.onBtnOver(this.objectiveButton); });
        this.objectiveButton.on("pointerout", () => { this.onBtnOut(this.objectiveButton); });
        this.objectiveButton.on("pointerdown", () => { this.onClickObjective(); });
        this.add(this.objectiveButton);

        const objectiveBck = new Phaser.GameObjects.Graphics(this.scene);
        objectiveBck.fillStyle(0xFFFFFF);
        objectiveBck.fillRect(-width / 2, -height / 2, width, height);
        objectiveBck.lineStyle(2, 0xFFFFFF);
        objectiveBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.objectiveButton.add(objectiveBck);

        this.objectiveText = new Phaser.GameObjects.Text(this.scene, 0, 0, "FIXED TARGET (" + (anutoTurret.fixedTarget ? "On" : "Off") + ")" , {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.objectiveText.setOrigin(.5);
        this.objectiveButton.add(this.objectiveText);

        offY += 90;

        this.levelButton = new Phaser.GameObjects.Container(this.scene);
        this.levelButton.setPosition(0, offY);
        this.levelButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.levelButton.on("pointerover", () => { this.onBtnOver(this.levelButton); });
        this.levelButton.on("pointerout", () => { this.onBtnOut(this.levelButton); });
        this.levelButton.on("pointerdown", () => { this.onClickLevel(); });
        this.add(this.levelButton);

        const levelBck = new Phaser.GameObjects.Graphics(this.scene);
        levelBck.fillStyle(0xFFFFFF);
        levelBck.fillRect(-width / 2, -height / 2, width, height);
        levelBck.lineStyle(2, 0xFFFFFF);
        levelBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.levelButton.add(levelBck);

        this.levelUpText = new Phaser.GameObjects.Text(this.scene, 0, 0, "LEVEL UP (" + GameVars.formatNumber(anutoTurret.priceImprovement) + ")" , {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.levelUpText.setOrigin(.5);
        this.levelButton.add(this.levelUpText);

        offY += 65;

        this.upgradeButton = new Phaser.GameObjects.Container(this.scene);
        this.upgradeButton.setPosition(0, offY);
        this.upgradeButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.upgradeButton.on("pointerover", () => { this.onBtnOver(this.upgradeButton); });
        this.upgradeButton.on("pointerout", () => { this.onBtnOut(this.upgradeButton); });
        this.upgradeButton.on("pointerdown", () => { this.onClickUpgrade(); });
        this.add(this.upgradeButton);

        const upgradeBck = new Phaser.GameObjects.Graphics(this.scene);
        upgradeBck.fillStyle(0xFFFFFF);
        upgradeBck.fillRect(-width / 2, -height / 2, width, height);
        upgradeBck.lineStyle(2, 0xFFFFFF);
        upgradeBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.upgradeButton.add(upgradeBck);

        this.upgradeText = new Phaser.GameObjects.Text(this.scene, 0, 0, "UPGRADE (" + GameVars.formatNumber(anutoTurret.priceUpgrade) + ")" , {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.upgradeText.setOrigin(.5);
        this.upgradeButton.add(this.upgradeText);

        offY += 65;

        this.sellButton = new Phaser.GameObjects.Container(this.scene);
        this.sellButton.setPosition(0, offY);
        this.sellButton.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.sellButton.on("pointerover", () => { this.onBtnOver(this.sellButton); });
        this.sellButton.on("pointerout", () => { this.onBtnOut(this.sellButton); });
        this.sellButton.on("pointerdown", () => { this.onClickSell(); });
        this.add(this.sellButton);

        const sellBck = new Phaser.GameObjects.Graphics(this.scene);
        sellBck.fillStyle(0xFFFFFF);
        sellBck.fillRect(-width / 2, -height / 2, width, height);
        sellBck.lineStyle(2, 0xFFFFFF);
        sellBck.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.sellButton.add(sellBck);

        this.sellText = new Phaser.GameObjects.Text(this.scene, 0, 0, "SELL (" + GameVars.formatNumber(anutoTurret.sellValue) + ")" , {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.sellText.setOrigin(.5);
        this.sellButton.add(this.sellText);

        this.checkAndUpdateInfo();
    }

    public checkAndUpdateInfo(): void {

        if (this.anutoTurret.type === Anuto.GameConstants.TURRET_GLUE) {

            if (this.anutoTurret.grade === 3) {

                this.durationTextAux.visible = false;
                this.durationText.visible = false;

                this.intensityTextAux.visible = false;
                this.intensityText.visible = false;

                this.distanceTextAux.visible = true;
                this.distanceText.visible = true;
            } else {

                this.durationTextAux.visible = true;
                this.durationText.visible = true;

                this.intensityTextAux.visible = true;
                this.intensityText.visible = true;

                this.distanceTextAux.visible = false;
                this.distanceText.visible = false;
            }
        }

        // update en la informacion de los botones

        this.levelUpText.setText("LEVEL UP (" + GameVars.formatNumber(this.anutoTurret.priceImprovement) + ")" );
        this.upgradeText.setText("UPGRADE (" + GameVars.formatNumber(this.anutoTurret.priceUpgrade) + ")" );
        this.sellText.setText("SELL (" + GameVars.formatNumber(this.anutoTurret.sellValue) + ")" );

        // desactivar botones no necesarios

        if ((this.anutoTurret.type === Anuto.GameConstants.TURRET_GLUE && this.anutoTurret.grade === 1) || (this.anutoTurret.type === Anuto.GameConstants.TURRET_LAUNCH && this.anutoTurret.grade === 2)) {
            this.strategyButton.alpha = .5;
            this.objectiveButton.alpha = .5;

            this.strategyText.setText("STRATEGY");
            this.objectiveText.setText("FIXED TARGET");
        }

        // si ya estamos a level maximo desactivar el boton

        if (this.anutoTurret.level === this.anutoTurret.maxLevel) {
            this.levelButton.alpha = .5;
            this.levelUpText.setText("LEVEL UP");
        } else {
            this.levelButton.alpha = 1;
        }

        // si ya estamos a upgrade maximo desactivar el boton

        if (this.anutoTurret.grade === 3) {
            this.upgradeButton.alpha = .5;
            this.upgradeText.setText("UPGRADE");
        }

        // si no hay suficientes creditos desactivar botones de level up y upgrade

        if (BattleManager.anutoEngine.credits < this.anutoTurret.priceImprovement) {
            this.levelButton.alpha = .5;
        }

        
        if (BattleManager.anutoEngine.credits < this.anutoTurret.priceUpgrade) {
            this.upgradeButton.alpha = .5;
        }

        // update de la informacion en texto
        
        this.levelText.setText(this.anutoTurret.level + "/" + this.anutoTurret.maxLevel);

        if (this.anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            this.damageText.setText(GameVars.formatNumber(this.anutoTurret.damage));
        } else {
            this.intensityText.setText(GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).intensity));
            this.durationText.setText(GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).duration));
            this.distanceText.setText(GameVars.formatNumber((this.anutoTurret as Anuto.GlueTurret).teleportDistance));
        }

        if (this.anutoTurret.type === Anuto.GameConstants.TURRET_LAUNCH) {
            this.explosionText.setText(GameVars.formatNumber((this.anutoTurret as Anuto.LaunchTurret).explosionRange));
        }

            this.reloadText.setText(GameVars.formatNumber(this.anutoTurret.reload));
            this.rangeText.setText(GameVars.formatNumber(this.anutoTurret.range));

        if (this.anutoTurret.type !== Anuto.GameConstants.TURRET_GLUE) {
            this.inflictedText.setText(GameVars.formatNumber(this.anutoTurret.inflicted));
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

    private onClickStrategy(): void {

        if (this.strategyButton.alpha !== 1) {
            return;
        }

        BattleManager.setNextStrategy(this.anutoTurret.id);
        
        this.strategyText.setText("STRATEGY (" + this.anutoTurret.shootingStrategy + ")");
    }

    private onClickObjective(): void {

        if (this.objectiveButton.alpha !== 1) {
            return;
        }

        BattleManager.setFixedTarget(this.anutoTurret.id);
        
        this.objectiveText.setText("FIXED TARGET (" + (this.anutoTurret.fixedTarget ? "On" : "Off") + ")");
    }

    private onClickLevel(): void {

        if (this.levelButton.alpha !== 1) {
            return;
        }

        BattleManager.improveTurret(this.anutoTurret.id);
        this.checkAndUpdateInfo();
    }

    private onClickUpgrade(): void {

        if (this.upgradeButton.alpha !== 1) {
            return;
        }

        BattleManager.upgradeTower(this.anutoTurret.id);
        this.checkAndUpdateInfo();
    }

    private onClickSell(): void {
        BattleManager.sellTurret(this.anutoTurret);
    }
}
