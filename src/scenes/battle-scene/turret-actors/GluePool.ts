import { GameConstants } from "../../../GameConstants";
import { GlueTurretActor } from "./GlueTurretActor";
import { GameVars } from "../../../GameVars";
import { AudioManager } from "../../../AudioManager";
import * as Anuto from "../../../../engine/src";

export class GluePool extends Phaser.GameObjects.Container {

    public id: number;

    private glueTurretActor: GlueTurretActor;
    private anutoGlue: Anuto.Glue;

    constructor(scene: Phaser.Scene, glueTurretActor: GlueTurretActor, anutoGlue: Anuto.Glue) {

        super(scene);

        this.glueTurretActor = glueTurretActor;
        this.anutoGlue = anutoGlue;

        this.id = anutoGlue.id;

        this.x = this.glueTurretActor.x;
        this.y = this.glueTurretActor.y;

        let range = this.anutoGlue.range * GameConstants.CELLS_SIZE;

        let rangeCircle = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "area_freeze");
        rangeCircle.setScale((range * 2) / rangeCircle.width);
        this.add(rangeCircle);

        this.drawFx();

        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 600 : 200,
        });

        this.setScale(0);
        this.alpha = 0;

        AudioManager.playSound("t3_pegamento");
    }

    public destroy(): void {

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 600 : 200,
            onComplete: () => {
                super.destroy();
            },
            onCompleteScope: this
        });
    }

    private drawFx(): void {

        let angleExtra = Math.random() * 180;

        let pos = 40;
        let angle = Phaser.Math.DegToRad(Math.random() * 40 - 20 + angleExtra);

        let fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle), pos * Math.sin(angle), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.4);
        this.add(fx);

        pos = 65;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle), pos * Math.sin(angle), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.25);
        this.add(fx);

        angle = Phaser.Math.DegToRad(100 + Math.random() * 40 + angleExtra);
        pos = 40;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle), pos * Math.sin(angle), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.25);
        this.add(fx);

        pos = 65;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle), pos * Math.sin(angle), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.4);
        this.add(fx);

        pos = 54;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle + .45), pos * Math.sin(angle + .45), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.15);
        this.add(fx);

        angle = Phaser.Math.DegToRad(220 + Math.random() * 40 + angleExtra);
        pos = 50;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle - .1), pos * Math.sin(angle - .1), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.3);
        this.add(fx);

        pos = 65;

        fx = new Phaser.GameObjects.Image(this.scene, pos * Math.cos(angle + .25), pos * Math.sin(angle + .25), "texture_atlas_1", "bullet_fx_3");
        fx.setScale(.25);
        this.add(fx);
    }
}
