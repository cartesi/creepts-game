import { EnemyActor } from "./EnemyActor";
import { GameConstants } from "../../../GameConstants";

export class HealerEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);

        const s = GameConstants.CELLS_SIZE * .35;

        this.img = new Phaser.GameObjects.Graphics(this.scene);
        this.img.lineStyle(7, 0xcb2929);
        this.img.strokeTriangle(-s, s, s, s, 0, -s);
        this.add(this.img);
    }

    public update(time: number, delta: number): void {

        super.update(time, delta);

        const anutoEnemy = <Anuto.HealerEnemy> this.anutoEnemy;

        if (anutoEnemy.healing) {
            this.img.alpha = .5;
        } else {
            this.img.alpha = 1;
        }
    }
}
