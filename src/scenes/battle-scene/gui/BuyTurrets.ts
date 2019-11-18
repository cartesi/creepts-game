import { TurretButton } from "./TurretButton";
import * as Anuto from "../../../../engine/src";

export class BuyTurrets extends Phaser.GameObjects.Container {

    private turretButtons: TurretButton[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 33;
        this.x = 130;

        this.turretButtons = [];

        let types = [Anuto.GameConstants.TURRET_PROJECTILE, Anuto.GameConstants.TURRET_LASER, Anuto.GameConstants.TURRET_LAUNCH, Anuto.GameConstants.TURRET_GLUE];

        for (let i = 0; i < 4; i++) {

            let turretButton = new TurretButton(this.scene, types[i], i);
            this.add(turretButton);
            this.turretButtons.push(turretButton);
        }
    }
}
