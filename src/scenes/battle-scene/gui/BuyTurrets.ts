import { TurretButton } from "./TurretButton";
import * as Creepts from "../../../../engine/src";

export class BuyTurrets extends Phaser.GameObjects.Container {

    private turretButtons: TurretButton[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 33;
        this.x = 130;

        this.turretButtons = [];

        let types = [Creepts.GameConstants.TURRET_PROJECTILE, Creepts.GameConstants.TURRET_LASER, Creepts.GameConstants.TURRET_LAUNCH, Creepts.GameConstants.TURRET_GLUE];

        for (let i = 0; i < 4; i++) {

            let turretButton = new TurretButton(this.scene, types[i], i);
            this.add(turretButton);
            this.turretButtons.push(turretButton);
        }
    }
}
