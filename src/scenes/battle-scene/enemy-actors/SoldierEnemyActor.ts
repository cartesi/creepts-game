import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class SoldierEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);

        const s = GameConstants.CELLS_SIZE * .75;
        
        this.img = new Phaser.GameObjects.Graphics(this.scene);
        this.img.fillStyle(0xFFA500);
        this.img.fillRect(-s / 2, -s / 2, s, s);

        this.add(this.img);
    }
}
