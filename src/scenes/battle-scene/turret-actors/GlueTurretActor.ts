import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class GlueTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_GLUE, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_3_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);
    }

    public update(time: number, delta: number): void {
        
        //
    }

    public shootGlue(): void {

        // 
    }
}
