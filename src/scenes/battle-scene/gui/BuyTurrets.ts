import { TurretButton } from "./TurretButton";

export class BuyTurrets extends Phaser.GameObjects.Container {

    private turretButtons: TurretButton[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 75;
        this.x = 50;

        this.turretButtons = [];

        let types = [Anuto.GameConstants.TURRET_PROJECTILE, Anuto.GameConstants.TURRET_LASER, Anuto.GameConstants.TURRET_LAUNCH, Anuto.GameConstants.TURRET_GLUE];

        for (let i = 0; i < 4; i++) {

            let turretButton = new TurretButton(this.scene, types[i], i);
            this.add(turretButton);
            this.turretButtons.push(turretButton);
        }
    }
}
