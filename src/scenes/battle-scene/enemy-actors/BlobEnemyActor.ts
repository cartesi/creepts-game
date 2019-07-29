import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class BlobEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);

        this.img = new Phaser.GameObjects.Graphics(this.scene);
        this.img.lineStyle(8, 0xFFC0CB);
        this.img.strokeCircle(0, 0, GameConstants.CELLS_SIZE * .325);
        
        this.add(this.img);
    }
}
