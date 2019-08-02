import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class GlueTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_GLUE, position);

        const tmpImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "tmp-glue-turret");
        tmpImage.setScale(GameConstants.CELLS_SIZE / tmpImage.width * .8);
        tmpImage.setInteractive();
        tmpImage.on("pointerdown", this.onDownTurret, this);
        this.addAt(tmpImage, 0);

        this.canon.visible = false;
    }

    public update(time: number, delta: number): void {
        
        //
    }

    public shootGlue(): void {

        // 
    }
}
