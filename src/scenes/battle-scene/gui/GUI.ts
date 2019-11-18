import { TurretSelected } from "./TurretSelected";
import { BuyTurrets } from "./BuyTurrets";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import { GameManager } from "../../../GameManager";
import { GameConstants } from "../../../GameConstants";

export class GUI extends Phaser.GameObjects.Container {

    private menuButton: Phaser.GameObjects.Image;
    private timeStepButton: Phaser.GameObjects.Image;
    private pauseButton: Phaser.GameObjects.Image;
    private nextWaveButton: Phaser.GameObjects.Image;
    private autoButton: Phaser.GameObjects.Image;

    private buyTurrets: BuyTurrets;
    private turretSelected: TurretSelected;

    constructor(scene: Phaser.Scene) {

        super(scene);

        // this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleY;

        let bck = new Phaser.GameObjects.Image(this.scene, 66, 4, "texture_atlas_1", "menu_bar");
        bck.setOrigin(0);
        this.add(bck);

        this.menuButton = new Phaser.GameObjects.Image(this.scene, 35, 45, "texture_atlas_1", "btn_menu");
        this.menuButton.setInteractive();
        this.menuButton.on("pointerdown", () => { this.onClickMenu(); });
        this.menuButton.on("pointerover", () => { this.onBtnOver(this.menuButton); });
        this.menuButton.on("pointerout", () => { this.onBtnOut(this.menuButton); });
        this.add(this.menuButton);

        this.buyTurrets = new BuyTurrets(this.scene);
        this.add(this.buyTurrets);

        this.timeStepButton = new Phaser.GameObjects.Image(this.scene, 510, 45, "texture_atlas_1", "btn_x1");
        this.timeStepButton.setInteractive();
        this.timeStepButton.on("pointerdown", () => { this.onClickTimeStep(); });
        this.timeStepButton.on("pointerover", () => { this.onBtnOver(this.timeStepButton); });
        this.timeStepButton.on("pointerout", () => { this.onBtnOut(this.timeStepButton); });
        this.add(this.timeStepButton);

        this.pauseButton = new Phaser.GameObjects.Image(this.scene, 580, 45, "texture_atlas_1", "btn_pause");
        this.pauseButton.setInteractive();
        this.pauseButton.on("pointerdown", () => { this.onClickPause(); });
        this.pauseButton.on("pointerover", () => { this.onBtnOver(this.pauseButton); });
        this.pauseButton.on("pointerout", () => { this.onBtnOut(this.pauseButton); });
        this.add(this.pauseButton);

        this.nextWaveButton = new Phaser.GameObjects.Image(this.scene, 650, 45, "texture_atlas_1", "btn_next_wave");
        this.nextWaveButton.setInteractive();
        this.nextWaveButton.on("pointerdown", () => { this.onClickNextWave(); });
        this.nextWaveButton.on("pointerover", () => { this.onBtnOver(this.nextWaveButton); });
        this.nextWaveButton.on("pointerout", () => { this.onBtnOut(this.nextWaveButton); });
        this.add(this.nextWaveButton);

        this.autoButton = new Phaser.GameObjects.Image(this.scene, 720, 45, "texture_atlas_1", "btn_auto");
        this.autoButton.setInteractive();
        this.autoButton.on("pointerdown", () => { this.onClickAuto(); });
        this.autoButton.on("pointerover", () => { this.onBtnOver(this.autoButton); });
        this.autoButton.on("pointerout", () => { this.onBtnOut(this.autoButton); });
        this.add(this.autoButton);

        this.scene.time.addEvent({ delay: 3000, callback: () => {
            if (this.nextWaveButton.alpha === 1 && BattleManager.anutoEngine.noEnemiesOnStage) {
                this.scene.tweens.add({
                    targets: this.nextWaveButton,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: 200,
                    yoyo: true
                });
            }
        }, callbackScope: this, loop: true});

        if (GameVars.autoSendWave) {
            this.autoButton.setFrame("btn_auto");
        } else {
            this.autoButton.setFrame("btn_auto_off");
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
        this.nextWaveButton.setScale(1);
        BattleManager.newWave();
    }

    private onClickTimeStep(): void {

        if (this.timeStepButton.alpha !== 1 || GameVars.paused) {
            return;
        }

        if (GameVars.timeStepFactor === 1) {
            BattleManager.setTimeStepFactor(4);
            this.timeStepButton.setFrame("btn_x4");
        } else if (GameVars.timeStepFactor === 4) {
            BattleManager.setTimeStepFactor(8);
            this.timeStepButton.setFrame("btn_x8");
        } else {
            BattleManager.setTimeStepFactor(1);
            this.timeStepButton.setFrame("btn_x1");
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
            this.pauseButton.setFrame("btn_pause");
        } else {
            BattleManager.semipause();
            this.pauseButton.setFrame("btn_play");
        }
    }

    private onClickAuto(): void {

        if (GameVars.autoSendWave) {
            this.autoButton.setFrame("btn_auto_off");
            BattleManager.setAutoSendWave(false);
        } else {
            this.autoButton.setFrame("btn_auto");
            BattleManager.setAutoSendWave(true);
        }
    }

    private onBtnOver(btn: any): void {

        if (btn.alpha === 1) {
            btn.setScale(1.1);
        }
    }

    private onBtnOut(btn: any): void {
        
        if (btn.alpha === 1) {
            btn.setScale(1);
        }
    }
}
