import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class RunnerEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);
    
        this.img = new Phaser.GameObjects.Graphics(this.scene);
        this.img.fillStyle(0xAB2A3E);
        this.img.fillCircle(0, 0, GameConstants.CELLS_SIZE * .4);
        
        this.add(this.img);
    }
}
