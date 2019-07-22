import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { LifeBar } from "./LifeBar";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;
    public id: number;
   
    private img: Phaser.GameObjects.Graphics;
    private lifeBar: LifeBar;
    private anutoEnemy: Anuto.Enemy;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.anutoEnemy = anutoEnemy;
        this.id = this.anutoEnemy.id;
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

        this.lifeBar = new LifeBar(this.scene);
        this.lifeBar.y = -26;
        this.lifeBar.x -= LifeBar.WIDTH / 2;
        this.add(this.lifeBar);

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);
    }

    public update(time: number, delta: number): void {

        let smoothFactor = GameVars.timeStepFactor === 4 ? .5 : .15;
        this.y += (this.anutoEnemy.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
    }
}
