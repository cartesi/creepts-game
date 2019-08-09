import { TurretSelected } from './TurretSelected';
import { BuyTurrets } from './BuyTurrets';
import { Button } from "../../../utils/Utils";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import { GameManager } from "../../../GameManager";

export class GUI extends Phaser.GameObjects.Container {

    private menuButton: Phaser.GameObjects.Container;
    private timeStepButton: Phaser.GameObjects.Container;
    private nextWaveButton: Phaser.GameObjects.Container;

    private timeStepText: Phaser.GameObjects.Text;

    private buyTurrets: BuyTurrets;
    private turretSelected: TurretSelected;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.buyTurrets = new BuyTurrets(this.scene);
        this.add(this.buyTurrets);

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        this.menuButton = new Phaser.GameObjects.Container(this.scene);
        this.menuButton.setPosition(430, 79);
        this.menuButton.setInteractive(new Phaser.Geom.Rectangle(-55, -30, 110, 60), Phaser.Geom.Rectangle.Contains);
        this.menuButton.on("pointerdown", () => { this.onClickMenu(); });
        this.menuButton.on("pointerover", () => { this.onBtnOver(this.menuButton); });
        this.menuButton.on("pointerout", () => { this.onBtnOut(this.menuButton); });
        this.add(this.menuButton);

        const menuBck = new Phaser.GameObjects.Graphics(this.scene);
        menuBck.fillStyle(0x000000);
        menuBck.fillRect(-55, -30, 110, 60);
        this.menuButton.add(menuBck);

        const menuText = new Phaser.GameObjects.Text(this.scene, 0, 0, "MENU" , {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
        menuText.setOrigin(.5);
        this.menuButton.add(menuText);

        this.timeStepButton = new Phaser.GameObjects.Container(this.scene);
        this.timeStepButton.setPosition(530, 79);
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

        this.nextWaveButton = new Phaser.GameObjects.Container(this.scene);
        this.nextWaveButton.setPosition(665, 79);
        this.nextWaveButton.setInteractive(new Phaser.Geom.Rectangle(-90, -30, 180, 60), Phaser.Geom.Rectangle.Contains);
        this.nextWaveButton.on("pointerdown", () => { this.onClickNextWave(); });
        this.nextWaveButton.on("pointerover", () => { this.onBtnOver(this.nextWaveButton); });
        this.nextWaveButton.on("pointerout", () => { this.onBtnOut(this.nextWaveButton); });
        this.add(this.nextWaveButton);

        const nextWaveBck = new Phaser.GameObjects.Graphics(this.scene);
        nextWaveBck.fillStyle(0x000000);
        nextWaveBck.fillRect(-90, -30, 180, 60);
        this.nextWaveButton.add(nextWaveBck);

        const nextWaveText = new Phaser.GameObjects.Text(this.scene, 0, 0, "NEXT WAVE" , {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
        nextWaveText.setOrigin(.5);
        this.nextWaveButton.add(nextWaveText);
    }

    public updateTurretButtons(): void {

        this.buyTurrets.updateTurretButtons();
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

    private onClickTimeStep(): void {

        if (this.timeStepButton.alpha !== 1 || GameVars.paused) {
            return;
        }

        if (GameVars.timeStepFactor === 1) {
            BattleManager.setTimeStepFactor(4);
            this.timeStepText.setText("x4");
        } else {
            BattleManager.setTimeStepFactor(1);
            this.timeStepText.setText("x1");
        }
    }

    private onClickMenu(): void {

        BattleManager.onClickMenu();
    }

    private onClickNextWave(): void {

        if (this.nextWaveButton.alpha !== 1 || GameVars.paused) {
            return;
        }
        
        this.nextWaveButton.alpha = .5;
        BattleManager.newWave();
        
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
}
