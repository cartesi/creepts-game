import { EnemyActor } from "./EnemyActor";

export class BlobEnemyActor extends EnemyActor {

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene, anutoEnemy, position);
    }
}
