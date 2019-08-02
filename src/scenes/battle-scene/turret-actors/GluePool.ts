import { GameConstants } from "../../../GameConstants";
import { GlueTurretActor } from "./GlueTurretActor";

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
        graphic.fillStyle(0x99ffff, .5);
        graphic.fillCircle(0, 0, range);
        this.add(graphic);
    }
}
