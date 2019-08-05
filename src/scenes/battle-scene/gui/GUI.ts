import { TurretSelected } from './TurretSelected';
import { BuyTurrets } from './BuyTurrets';
import { Button } from "../../../utils/Utils";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import { GameManager } from "../../../GameManager";

export class GUI extends Phaser.GameObjects.Container {

    private timeStepMultiplierButton1x: Button;
    private timeStepMultiplierButton4x: Button;

    private turretSelected: TurretSelected;

    constructor(scene: Phaser.Scene) {

        super(scene);

        let buyTurrets = new BuyTurrets(this.scene);
        this.add(buyTurrets);

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        this.timeStepMultiplierButton4x = new Button(this.scene, 480, 35 * GameVars.scaleY, "texture_atlas_1", "btn_4x_off", "btn_4x_on", true);
        this.timeStepMultiplierButton4x.onDown(this.onClick4x, this);
        this.timeStepMultiplierButton4x.scaleY = GameVars.scaleY;
        this.add(this.timeStepMultiplierButton4x);

        this.timeStepMultiplierButton1x = new Button(this.scene, 480, 35 * GameVars.scaleY, "texture_atlas_1", "btn_1x_off", "btn_1x_on", true);
        this.timeStepMultiplierButton1x.onDown(this.onClick1x, this);
        this.timeStepMultiplierButton1x.scaleY = GameVars.scaleY;
        this.timeStepMultiplierButton1x.visible = false;
        this.add(this.timeStepMultiplierButton1x);

        const nextWaveButton = new Button(this.scene, 610, 35 * GameVars.scaleY, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        nextWaveButton.onDown(this.onClickNextWave, this);
        nextWaveButton.scaleY = GameVars.scaleY;
        this.add(nextWaveButton);

        const resetButton = new Button(this.scene, 610, 85 * GameVars.scaleY, "texture_atlas_1", "btn_reset_off", "btn_reset_on", true);
        resetButton.onDown(this.onClickReset, this);
        resetButton.scaleY = GameVars.scaleY;
        this.add(resetButton);

        const pauseButton = new Button(this.scene, 735, 35 * GameVars.scaleY, "texture_atlas_1", "btn_pause_off", "btn_pause_on", true);
        pauseButton.onDown(this.onClickPauseWave, this);
        pauseButton.scaleY = GameVars.scaleY;
        this.add(pauseButton);
    }

    public createTurret(type: string): void {

        this.turretSelected = new TurretSelected(this.scene, type, this);
        this.add(this.turretSelected);
    }

    public removeTurret(): void {

        this.remove(this.turretSelected);
        this.turretSelected = null;
    }

    private onClick4x(): void {

        this.timeStepMultiplierButton1x.visible = true;
        this.timeStepMultiplierButton4x.visible = false;

        BattleManager.setTimeStepFactor(4);
    }

    private onClick1x(): void {
        
        this.timeStepMultiplierButton1x.visible = false;
        this.timeStepMultiplierButton4x.visible = true;

        BattleManager.setTimeStepFactor(1);
    }

    private onClickPauseWave(): void {

        if (GameVars.paused) {
            BattleManager.resume();
        } else {
            BattleManager.pause();
        }
    }

    private onClickNextWave(): void {
        
        BattleManager.newWave();
    }

    private onClickReset(): void {

        GameManager.reset();
    }
}
