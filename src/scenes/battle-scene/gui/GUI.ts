import { TurretSelected } from "./TurretSelected";
import { BuyTurrets } from "./BuyTurrets";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import { GameManager } from "../../../GameManager";

export class GUI extends Phaser.GameObjects.Container {

    private menuButton: Phaser.GameObjects.Container;
    private timeStepButton: Phaser.GameObjects.Container;
    private pauseButton: Phaser.GameObjects.Container;
    private nextWaveButton: Phaser.GameObjects.Container;
    private autoButton: Phaser.GameObjects.Container;

    private timeStepText: Phaser.GameObjects.Text;
    private pauseImg: Phaser.GameObjects.Image;
    private autoImage: Phaser.GameObjects.Image;

    private buyTurrets: BuyTurrets;
    private turretSelected: TurretSelected;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.buyTurrets = new BuyTurrets(this.scene);
        this.add(this.buyTurrets);

        // this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleY;

        this.menuButton = new Phaser.GameObjects.Container(this.scene);
        this.menuButton.setPosition(400, 79);
        this.menuButton.setInteractive(new Phaser.Geom.Rectangle(-50, -30, 100, 60), Phaser.Geom.Rectangle.Contains);
        this.menuButton.on("pointerdown", () => { this.onClickMenu(); });
        this.menuButton.on("pointerover", () => { this.onBtnOver(this.menuButton); });
        this.menuButton.on("pointerout", () => { this.onBtnOut(this.menuButton); });
        this.add(this.menuButton);

        const menuBck = new Phaser.GameObjects.Graphics(this.scene);
        menuBck.fillStyle(0x000000);
        menuBck.fillRect(-50, -30, 100, 60);
        this.menuButton.add(menuBck);

        const menuText = new Phaser.GameObjects.Text(this.scene, 0, 0, "MENU" , {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
        menuText.setOrigin(.5);
        this.menuButton.add(menuText);

        this.timeStepButton = new Phaser.GameObjects.Container(this.scene);
        this.timeStepButton.setPosition(490, 79);
        this.timeStepButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.timeStepButton.on("pointerdown", () => { this.onClickTimeStep(); });
        this.timeStepButton.on("pointerover", () => { this.onBtnOver(this.timeStepButton); });
        this.timeStepButton.on("pointerout", () => { this.onBtnOut(this.timeStepButton); });
        this.add(this.timeStepButton);

        const timeStepBck = new Phaser.GameObjects.Graphics(this.scene);
        timeStepBck.fillStyle(0x000000);
        timeStepBck.fillRect(-30, -30, 60, 60);
        this.timeStepButton.add(timeStepBck);

        this.timeStepText = new Phaser.GameObjects.Text(this.scene, 0, 0, "1x" , {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
        this.timeStepText.setOrigin(.5);
        this.timeStepButton.add(this.timeStepText);

        this.pauseButton = new Phaser.GameObjects.Container(this.scene);
        this.pauseButton.setPosition(560, 79);
        this.pauseButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.pauseButton.on("pointerdown", () => { this.onClickPause(); });
        this.pauseButton.on("pointerover", () => { this.onBtnOver(this.pauseButton); });
        this.pauseButton.on("pointerout", () => { this.onBtnOut(this.pauseButton); });
        this.add(this.pauseButton);

        const pauseBck = new Phaser.GameObjects.Graphics(this.scene);
        pauseBck.fillStyle(0x000000);
        pauseBck.fillRect(-30, -30, 60, 60);
        this.pauseButton.add(pauseBck);

        this.pauseImg = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "btn_pause");
        this.pauseButton.add(this.pauseImg);

        this.nextWaveButton = new Phaser.GameObjects.Container(this.scene);
        this.nextWaveButton.setPosition(645, 79);
        this.nextWaveButton.setInteractive(new Phaser.Geom.Rectangle(-45, -30, 90, 60), Phaser.Geom.Rectangle.Contains);
        this.nextWaveButton.on("pointerdown", () => { this.onClickNextWave(); });
        this.nextWaveButton.on("pointerover", () => { this.onBtnOver(this.nextWaveButton); });
        this.nextWaveButton.on("pointerout", () => { this.onBtnOut(this.nextWaveButton); });
        this.add(this.nextWaveButton);

        const nextWaveBck = new Phaser.GameObjects.Graphics(this.scene);
        nextWaveBck.fillStyle(0x000000);
        nextWaveBck.fillRect(-45, -30, 90, 60);
        this.nextWaveButton.add(nextWaveBck);

        const nextWaveText = new Phaser.GameObjects.Text(this.scene, 0, 0, "NEXT\nWAVE" , {fontFamily: "Rubik-Regular", fontSize: "22px", color: "#FFFFFF", align: "center"});
        nextWaveText.setOrigin(.5);
        this.nextWaveButton.add(nextWaveText);

        this.autoButton = new Phaser.GameObjects.Container(this.scene);
        this.autoButton.setPosition(730, 79);
        this.add(this.autoButton);

        this.autoImage = new Phaser.GameObjects.Image(this.scene, 0, 10, "texture_atlas_1");
        this.autoImage.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.autoImage.on("pointerdown", () => { this.onClickAuto(); });
        this.autoImage.on("pointerover", () => { this.onBtnOver(this.autoImage); });
        this.autoImage.on("pointerout", () => { this.onBtnOut(this.autoImage); });
        this.autoButton.add(this.autoImage);

        const autoText = new Phaser.GameObjects.Text(this.scene, 0, -20, "AUTO" , {fontFamily: "Rubik-Regular", fontSize: "20px", color: "#000000", align: "center"});
        autoText.setOrigin(.5);
        this.autoButton.add(autoText);

        if (GameVars.autoSendWave) {
            this.autoImage.setFrame("checkbox_tick");
        } else {
            this.autoImage.setFrame("checkbox");
        }
    }

    public createTurret(type: string): void {

        this.turretSelected = new TurretSelected(this.scene, type, this);
        this.add(this.turretSelected);
    }

    public removeTurret(): void {

        this.remove(this.turretSelected);
        this.turretSelected = null;
    }

    public activeNextWave(): void {

        this.nextWaveButton.alpha = 1;
    }

    public onClickNextWave(): void {

        if (this.nextWaveButton.alpha !== 1 || GameVars.paused || BattleManager.anutoEngine.gameOver) {
            return;
        }
    
        this.nextWaveButton.alpha = .5;
        BattleManager.newWave();
    }

    private onClickTimeStep(): void {

        if (this.timeStepButton.alpha !== 1 || GameVars.paused) {
            return;
        }

        if (GameVars.timeStepFactor === 1) {
            BattleManager.setTimeStepFactor(4);
            this.timeStepText.setText("4x");
        } else if (GameVars.timeStepFactor === 4) {
            BattleManager.setTimeStepFactor(8);
            this.timeStepText.setText("8x");
        } else {
            BattleManager.setTimeStepFactor(1);
            this.timeStepText.setText("1x");
        }
    }

    private onClickMenu(): void {

        if (BattleManager.anutoEngine.gameOver) {
            return;
        }

        BattleManager.onClickMenu();
    }

    private onClickPause(): void {

        if (GameVars.paused) {
            return;
        }

        if (GameVars.semipaused) {
            BattleManager.semiresume();
            this.pauseImg.setFrame("btn_pause");
        } else {
            BattleManager.semipause();
            this.pauseImg.setFrame("btn_play");
        }
    }

    private onClickAuto(): void {

        if (GameVars.autoSendWave) {
            this.autoImage.setFrame("checkbox");
            BattleManager.setAutoSendWave(false);
        } else {
            this.autoImage.setFrame("checkbox_tick");
            BattleManager.setAutoSendWave(true);
        }
    }

    private onBtnOver(btn: any): void {

        if (btn.alpha === 1) {
            btn.setScale(1.025);
        }
    }

    private onBtnOut(btn: any): void {
        
        if (btn.alpha === 1) {
            btn.setScale(1);
        }
    }
}
