import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class ProjectileTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_PROJECTILE, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_1_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_1_1_1");
        this.add(this.canon);
    }

    public shootBullet(): void {
        // hacer que el cañon retroceda
        this.canon.rotation = this.anutoTurret.shootAngle + Math.PI / 2;
    }
}
