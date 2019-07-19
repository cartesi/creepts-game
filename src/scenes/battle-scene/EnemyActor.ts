import { GameConstants } from "../../GameConstants";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;

    private img: Phaser.GameObjects.Graphics;
    private anutoEnemy: Anuto.Enemy;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.anutoEnemy = anutoEnemy;
        this.type = this.anutoEnemy.type;

        if (this.type === "enemy_1") {

            let s = GameConstants.CELLS_SIZE * .75;
            
            this.img = new Phaser.GameObjects.Graphics(this.scene);
            this.img.fillStyle(0xFF0000);
            this.img.fillRect(-s / 2, -s / 2, s, s);

        } else if (this.type === "enemy_1") {
            //
        }

        this.add(this.img);

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);
    }

    public update(time: number, delta: number): void {
        
        // console.log("UPDATE ENEMIGO:", this.id, this.anutoEnemy.y);
    }
}
