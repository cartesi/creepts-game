import { TurretButton } from "./TurretButton";

export class BuyTurrets extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 85;
        this.x = 40;

        let types = [Anuto.GameConstants.TURRET_PROJECTILE, Anuto.GameConstants.TURRET_LASER, Anuto.GameConstants.TURRET_LAUNCH, Anuto.GameConstants.TURRET_GLUE];

        for (let i = 0; i < 4; i++) {

            let turretButton = new TurretButton(this.scene, types[i], i);
            this.add(turretButton);
        }
    }
}
