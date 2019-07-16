import { Button } from "../../utils/Utils";
import { BattleManager } from "./BattleManager";

export class GUI extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const nextWaveButton = new Button(this.scene, 670, 35, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        nextWaveButton.onDown(this.onClickNextWave, this);
        this.add(nextWaveButton);
    }

    private onClickNextWave(): void {
        
        BattleManager.newWave();
    }
}
