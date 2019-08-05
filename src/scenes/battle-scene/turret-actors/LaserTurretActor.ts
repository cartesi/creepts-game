import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class LaserTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_LASER, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_2_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_2_1_1");
        this.add(this.canon);

        this.canonLength = 30;
    }

    public shootLaser(): void {
        // de momento nada, el cañon podria vibrar, retroceder o emitir un brillo
    }
}
