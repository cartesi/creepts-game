import { AudioManager } from './../../../AudioManager';
import { TurretActor } from "./TurretActor";
import { GameConstants } from "../../../GameConstants";

export class LaserTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene, Anuto.GameConstants.TURRET_LASER, position);

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "base_2_1");
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.addAt(this.base, 0);

        this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "canon_2_1_1");
        this.add(this.canon);

        this.canonLength = 30;
    }

    public upgrade(): void {

        super.upgrade();

        switch (this.anutoTurret.grade) {
 
             case 2:
                 this.base.setFrame("base_2_2");
                 this.canon.setFrame("canon_2_2_1");
                 break;
             case 3: 
                 this.base.setFrame("base_2_2");
                 this.canon.setFrame("canon_2_3_1");
                 break;
             default:
        }
    }

    public shootLaser(): void {

        AudioManager.playSound("t2_laser" + this.anutoTurret.grade);
    }
}
