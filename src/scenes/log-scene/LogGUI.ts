import { GameManager } from './../../GameManager';
import { BuyTurrets } from "../battle-scene/gui/BuyTurrets";
import { TurretSelected } from "../battle-scene/gui/TurretSelected";
import { GameVars } from "../../GameVars";
import { BattleManager } from "../battle-scene/BattleManager";
import { GameConstants } from '../../GameConstants';
import { AudioManager } from '../../AudioManager';

export class LogGUI extends Phaser.GameObjects.Container {

    private timeStepButton: Phaser.GameObjects.Container;
    private playButton: Phaser.GameObjects.Container;
    private backButton: Phaser.GameObjects.Container;
    private exitButton: Phaser.GameObjects.Container;
    private soundButton: Phaser.GameObjects.Container;

    private timeStepImage: Phaser.GameObjects.Image;
    private playImage: Phaser.GameObjects.Image;
    private backImage: Phaser.GameObjects.Image;
    private soundImage: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {

        super(scene);

        // this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleY;

        this.backButton = new Phaser.GameObjects.Container(this.scene);
        this.backButton.setPosition(GameConstants.GAME_WIDTH / 2 - 90, 79);
        this.backButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.backButton.on("pointerdown", () => { this.onClickBack(); });
        this.backButton.on("pointerover", () => { this.onBtnOver(this.backButton); });
        this.backButton.on("pointerout", () => { this.onBtnOut(this.backButton); });
        this.add(this.backButton);

        const backBck = new Phaser.GameObjects.Graphics(this.scene);
        backBck.fillStyle(0x000000);
        backBck.fillRect(-30, -30, 60, 60);
        this.backButton.add(backBck);

        this.backImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "btn_return");
        this.backButton.add(this.backImage);

        this.playButton = new Phaser.GameObjects.Container(this.scene);
        this.playButton.setPosition(GameConstants.GAME_WIDTH / 2, 79);
        this.playButton.setInteractive(new Phaser.Geom.Rectangle(-35, -35, 70, 70), Phaser.Geom.Rectangle.Contains);
        this.playButton.on("pointerdown", () => { this.onClickPlay(); });
        this.playButton.on("pointerover", () => { this.onBtnOver(this.playButton); });
        this.playButton.on("pointerout", () => { this.onBtnOut(this.playButton); });
        this.add(this.playButton);

        const playBck = new Phaser.GameObjects.Graphics(this.scene);
        playBck.fillStyle(0x000000);
        playBck.fillRect(-35, -35, 70, 70);
        this.playButton.add(playBck);

        this.playImage = new Phaser.GameObjects.Image(this.scene, 0, 2, "texture_atlas_1", "btn_pause");
        this.playImage.setOrigin(.5);
        this.playImage.setScale(1.2);
        this.playButton.add(this.playImage);

        this.timeStepButton = new Phaser.GameObjects.Container(this.scene);
        this.timeStepButton.setPosition(GameConstants.GAME_WIDTH / 2 + 90, 79);
        this.timeStepButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.timeStepButton.on("pointerdown", () => { this.onClickTimeStep(); });
        this.timeStepButton.on("pointerover", () => { this.onBtnOver(this.timeStepButton); });
        this.timeStepButton.on("pointerout", () => { this.onBtnOut(this.timeStepButton); });
        this.add(this.timeStepButton);

        const timeStepBck = new Phaser.GameObjects.Graphics(this.scene);
        timeStepBck.fillStyle(0x000000);
        timeStepBck.fillRect(-30, -30, 60, 60);
        this.timeStepButton.add(timeStepBck);

        this.timeStepImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1");
        this.timeStepImage.setOrigin(.5);
        this.timeStepButton.add(this.timeStepImage);

        if (GameVars.timeStepFactor === 1) {
            this.timeStepImage.setFrame("btn_normal_speed");
        } else {
            this.timeStepImage.setFrame("btn_fastforward");
        }

        this.exitButton = new Phaser.GameObjects.Container(this.scene);
        this.exitButton.setPosition(GameConstants.GAME_WIDTH - 40, 79);
        this.exitButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.exitButton.on("pointerdown", () => { this.onClickExit(); });
        this.exitButton.on("pointerover", () => { this.onBtnOver(this.exitButton); });
        this.exitButton.on("pointerout", () => { this.onBtnOut(this.exitButton); });
        this.add(this.exitButton);

        const exitBck = new Phaser.GameObjects.Graphics(this.scene);
        exitBck.fillStyle(0x000000);
        exitBck.fillRect(-30, -30, 60, 60);
        this.exitButton.add(exitBck);

        const exitImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "btn_exit");
        this.exitButton.add(exitImage);

        this.soundButton = new Phaser.GameObjects.Container(this.scene);
        this.soundButton.setPosition(GameConstants.GAME_WIDTH - 110, 79);
        this.soundButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
        this.soundButton.on("pointerdown", () => { this.onClickSound(); });
        this.soundButton.on("pointerover", () => { this.onBtnOver(this.soundButton); });
        this.soundButton.on("pointerout", () => { this.onBtnOut(this.soundButton); });
        this.add(this.soundButton);

        const soundBck = new Phaser.GameObjects.Graphics(this.scene);
        soundBck.fillStyle(0x000000);
        soundBck.fillRect(-30, -30, 60, 60);
        this.soundButton.add(soundBck);

        this.soundImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1");
        this.soundImage.setOrigin(.5);
        this.soundButton.add(this.soundImage);

        if (GameVars.gameData.soundMuted) {
            this.soundImage.setFrame("btn_sound_off");
        } else {
            this.soundImage.setFrame("btn_sound_on");
        }
    }

    private onClickPlay(): void {

        if (GameVars.paused) {
            BattleManager.resume();
            this.playImage.setFrame("btn_pause");
        } else {
            BattleManager.pause();
            this.playImage.setFrame("btn_play");
        }
    }

    private onClickTimeStep(): void {

        if (GameVars.timeStepFactor === 1) {
            BattleManager.setTimeStepFactor(8);
            this.timeStepImage.setFrame("btn_fastforward");
        } else {
            BattleManager.setTimeStepFactor(1);
            this.timeStepImage.setFrame("btn_normal_speed");
        }
    }

    private onClickBack(): void {

        GameManager.enterLogScene(GameVars.initialLogsObjects, GameVars.levelObject);
    }

    private onClickExit(): void {

        GameManager.events.emit("exit");
    }

    private onClickSound(): void {

        AudioManager.toggleSoundState();

        if (GameVars.gameData.soundMuted) {
            this.soundImage.setFrame("btn_sound_off");
        } else {
            this.soundImage.setFrame("btn_sound_on");
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
}