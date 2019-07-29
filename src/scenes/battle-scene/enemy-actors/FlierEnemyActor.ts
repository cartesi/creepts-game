import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class FlierEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);

        const s = GameConstants.CELLS_SIZE * .35;

        this.img = new Phaser.GameObjects.Graphics(this.scene);
        this.img.lineStyle(7, 0xFF1493);
        this.img.strokeTriangle(-s, s, s, s, 0, -s);
        this.img.strokeTriangle(-s, -s, s, -s, 0, s);
        this.add(this.img);
    }
}
