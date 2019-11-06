import { TurretActor } from "./TurretActor";
import { AudioManager } from "../../../AudioManager";
import { GameVars } from "../../../GameVars";
import * as Anuto from "../../../../engine/src";

export class GlueTurretActor extends TurretActor {

    constructor(scene: Phaser.Scene, position: {r: number, c: number}, turret: Anuto.Turret) {

        super(scene, Anuto.GameConstants.TURRET_GLUE, position, turret);

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

        if (this.anutoTurret.shootAngle) {
            this.canon.rotation = this.anutoTurret.shootAngle + Math.PI / 2;

            this.scene.tweens.add({
                targets: this.canon,
                x: this.canon.x - 5 * Math.sin(this.canon.rotation),
                y: this.canon.y + 5 * Math.cos(this.canon.rotation),
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: GameVars.timeStepFactor === 1 ? 80 : 20,
                yoyo: true
            });
        }

        if (this.anutoTurret.grade === 2) {
            AudioManager.playSound("t2_hielo");

            let fx = this.scene.add.sprite(30 * Math.sin(this.canon.rotation), - 30 * Math.cos(this.canon.rotation), "texture_atlas_1");
            fx.setScale(.25);
            this.add(fx);

            fx.anims.play("glue_fx");

            fx.on("animationcomplete", () => {
                fx.destroy();
            }, this);
        }
        
    }
}
