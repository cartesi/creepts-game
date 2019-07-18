import { GameConstants } from "../../GameConstants";

export class EnemyActor extends Phaser.GameObjects.Container {

    public id: number;

    private anutoEnemy: Anuto.Enemy;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.id = anutoEnemy.id;
        this.anutoEnemy = anutoEnemy;

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);

        // console.log(this.anutoEnemy);
    }

    public update(time: number, delta: number): void {
        
        // console.log("UPDATE ENEMIGO:", this.id, this.anutoEnemy.y);
    }
}
