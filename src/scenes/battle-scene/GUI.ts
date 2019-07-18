import { Button } from "../../utils/Utils";
import { BattleManager } from "./BattleManager";
import { GameConstants } from "../../GameConstants";

export class GUI extends Phaser.GameObjects.Container {

    private timeStepMultiplierButton1x: Button;
    private timeStepMultiplierButton4x: Button;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.timeStepMultiplierButton4x = new Button(this.scene, 540, 35, "texture_atlas_1", "btn_4x_off", "btn_4x_on", true);
        this.timeStepMultiplierButton4x.onDown(this.onClick4x, this);
        this.add(this.timeStepMultiplierButton4x);

        this.timeStepMultiplierButton1x = new Button(this.scene, 540, 35, "texture_atlas_1", "btn_1x_off", "btn_1x_on", true);
        this.timeStepMultiplierButton1x.onDown(this.onClick1x, this);
        this.timeStepMultiplierButton1x.visible = false;
        this.add(this.timeStepMultiplierButton1x);

        const nextWaveButton = new Button(this.scene, 670, 35, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        nextWaveButton.onDown(this.onClickNextWave, this);
        this.add(nextWaveButton);
    }

    private onClick4x(): void {

        console.log("CLICK!");
        
        this.timeStepMultiplierButton1x.visible = true;
        this.timeStepMultiplierButton4x.visible = false;

        BattleManager.setTimeStep(GameConstants.TIME_STEP / 4);
    }

    private onClick1x(): void {
        
        this.timeStepMultiplierButton1x.visible = false;
        this.timeStepMultiplierButton4x.visible = true;

        BattleManager.setTimeStep(GameConstants.TIME_STEP);
    }

    private onClickNextWave(): void {
        
        BattleManager.newWave();
    }
}
