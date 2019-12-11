import { EnemyActor } from "./EnemyActor";
import * as Creepts from "../../../../engine/src";

export class HealerEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, enemy: Creepts.Enemy, position: {r: number, c: number}) {

        super(scene, enemy, position);

        // this.img = this.scene.add.sprite(0, 0, "texture_atlas_1", "enemy_healer_1");
        // this.add(this.img);

        // this.img.anims.play("enemy_healer_run");
    }

    public update(time: number, delta: number): void {

        super.update(time, delta);

        const enemy = <Creepts.HealerEnemy> this.enemy;

        if (enemy.healing && this.img.anims.currentAnim.key === "enemy_healer_run") {
            if (this.enemy.affectedByGlue || this.enemy.affectedByGlueBullet) {
                this.img.anims.play("enemy_healer_heal_frozen");
            } else {
                this.img.anims.play("enemy_healer_heal");
            }
        } else if (!enemy.healing && this.img.anims.currentAnim.key === "enemy_healer_heal") {
            if (this.enemy.affectedByGlue || this.enemy.affectedByGlueBullet) {
                this.img.anims.play("enemy_healer_run_frozen");
            } else {
                this.img.anims.play("enemy_healer_run");
            }
        }
    }
}
