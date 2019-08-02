import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class FlierEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);

        const s = GameConstants.CELLS_SIZE * .35;

        this.img = this.scene.add.sprite(0, 0, "texture_atlas_1", "enemy_flier_1");
        this.add(this.img);

        this.img.anims.play("enemy_flier_run");
    }
}
