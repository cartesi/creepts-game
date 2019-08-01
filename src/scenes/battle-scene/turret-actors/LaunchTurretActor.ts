import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class LaunchTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_LAUNCH, position);

        const tmpImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "tmp-launch-turret");
        tmpImage.setScale(GameConstants.CELLS_SIZE / tmpImage.width * .8);
        tmpImage.setInteractive();
        tmpImage.on("pointerdown", this.onDownTurret, this);
        this.addAt(tmpImage, 0);
    }

    public update(time: number, delta: number): void {
        // esta torreta no orienta el cañón hacia el enemigo
    }

    public shootMortar(): void {
        // girar el cañón
        this.canon.rotation = this.anutoTurret.shootAngle;
    }
}
