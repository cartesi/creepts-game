import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;
    public id: number;
   
    private img: Phaser.GameObjects.Graphics;
    private anutoEnemy: Anuto.Enemy;
    private speed: number;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.anutoEnemy = anutoEnemy;
        this.id = this.anutoEnemy.id;
        this.type = this.anutoEnemy.type;

        // la velocidad en pixels por ticks
        this.speed = this.anutoEnemy.speed * GameConstants.CELLS_SIZE * (1000 / 60) / GameConstants.TIME_STEP;

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

        // this.y += this.speed * delta / (1000 / 60) * GameVars.timeStepFactor;
        // this.y = this.anutoEnemy.y * GameConstants.CELLS_SIZE;

        let smoothFactor = GameVars.timeStepFactor === 4 ? .5 : .15;

        this.y += (this.anutoEnemy.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
    }
}
