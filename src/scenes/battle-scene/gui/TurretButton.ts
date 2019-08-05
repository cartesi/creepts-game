import { BattleManager } from './../BattleManager';

export class TurretButton extends Phaser.GameObjects.Container {

    private base: Phaser.GameObjects.Image;
    private canon: Phaser.GameObjects.Image;

    private typeTurret: string;

    constructor(scene: Phaser.Scene, type: string, index: number) {

        super(scene);

        this.x = index * 60;
        this.typeTurret = type;

        let base_name;
        let canon_name;

        switch (type) {

            case Anuto.GameConstants.TURRET_PROJECTILE:
                base_name = "base_1_1";
                canon_name = "canon_1_1_1";
                break;
            case Anuto.GameConstants.TURRET_LASER:
                base_name = "base_2_1";
                canon_name = "canon_2_1_1";
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                base_name = "base_4_1";
                canon_name = "canon_4_1_3";
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                base_name = "base_3_1";
                break;
            default:
        }

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", base_name);
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.add(this.base);

        if (type !== Anuto.GameConstants.TURRET_GLUE) {
            this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", canon_name);
            this.add(this.canon);
        }
        
    }

    private onDownTurret(): void {

        BattleManager.createTurret(this.typeTurret);
    }
}
