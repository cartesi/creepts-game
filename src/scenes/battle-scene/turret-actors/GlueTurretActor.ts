import { TurretActor } from "./TurretActor";

export class GlueTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_GLUE, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_3_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_3_2_1");
        this.canon.visible = false;
        this.add(this.canon);
    }

    public update(time: number, delta: number): void {
        //
    }

    public upgrade(): void {

        super.upgrade();

        switch (this.anutoTurret.grade) {

            case 2:
                this.base.setFrame("base_3_2");
                this.canon.setFrame("canon_3_2_1");
                this.canon.visible = true;
                break;
            case 3: 
                this.base.setFrame("base_3_3");
                this.canon.visible = false;
                break;
            default:
       }
    }

    public shootGlue(): void {
        // hacer que el cañon retroceda
        this.canon.rotation = this.anutoTurret.shootAngle + Math.PI / 2;
    }
}
