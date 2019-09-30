import { EnemyActor } from "./EnemyActor";
import * as Anuto from "../../../../engine/src";

export class RunnerEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);
    
        this.img = this.scene.add.sprite(0, 0, "texture_atlas_1", "enemy_runner_1");
        this.add(this.img);

        this.img.anims.play("enemy_runner_run");
    }
}
