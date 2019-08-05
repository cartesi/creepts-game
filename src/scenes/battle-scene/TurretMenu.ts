import { Button } from "../../utils/Utils";

export class TurretMenu extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, anutoTurret: Anuto.Turret) {

        super(scene);

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0xFFFFFF);
        bck.fillRect(-150, -200, 300, 400);
        bck.lineStyle(4, 0x000000);
        bck.strokeRect(-150, -200, 300, 400);
        this.add(bck);

        const nextWaveButton = new Button(this.scene, 0, 0, "texture_atlas_1", "btn_start_off", "btn_start_on", true);
        nextWaveButton.onDown(this.onClickDown, this);
        this.add(nextWaveButton);
    }

    private onClickDown(): void {

        console.log("DOWN");
    }
}
