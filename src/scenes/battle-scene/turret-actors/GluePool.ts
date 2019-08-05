import { GameConstants } from "../../../GameConstants";
import { GlueTurretActor } from "./GlueTurretActor";
import { GameVars } from "../../../GameVars";

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

        let graphic = new Phaser.GameObjects.Graphics(this.scene);
        graphic.fillStyle(0x66CCFF, .5);
        graphic.fillCircle(0, 0, range);
        this.add(graphic);

        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 4 ? 200 : 600,
        });

        this.setScale(0);
        this.alpha = 0;
    }

    public destroy(): void {

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 4 ? 200 : 600,
            onComplete: () => {
                super.destroy();
            },
            onCompleteScope: this
        });
    }
}
