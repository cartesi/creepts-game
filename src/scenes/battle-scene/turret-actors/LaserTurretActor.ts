import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class LaserTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_LASER, position);

        const tmpImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "tmp-laser-turret");
        tmpImage.setScale(GameConstants.CELLS_SIZE / tmpImage.width * .8);
        tmpImage.setInteractive();
        tmpImage.on("pointerdown", this.onDownTurret, this);
        this.addAt(tmpImage, 0);
    }

    public shootLaser(): void {
        // de momento nada, el cañon podria vibrar, retroceder o emitir un brillo
    }
}
