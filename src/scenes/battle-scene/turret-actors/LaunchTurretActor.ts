import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class LaunchTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_LAUNCH, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_4_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_4_1_3");
        this.add(this.canon);
    }

    public update(time: number, delta: number): void {
        // esta torreta no orienta el cañón hacia el enemigo
    }

    public shootMortar(): void {
        // girar el cañón
        this.canon.rotation = this.anutoTurret.shootAngle + Math.PI / 2;
    }
}
