import { GameConstants } from "../../../GameConstants";
import { GlueTurretActor } from './GlueTurretActor';
import { GameVars } from "../../../GameVars";
import { threadId } from "worker_threads";

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

        this.scene.sys.updateList.add(this);

        let range = this.anutoGlue.range * GameConstants.CELLS_SIZE;

        let graphic = new Phaser.GameObjects.Graphics(this.scene);
        graphic.fillStyle(0x00ff00, .75);
        graphic.fillCircle(0, 0, range);
        this.add(graphic);

        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {
        
        // 
    }
}
