import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { LifeBar } from "./LifeBar";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;
    public id: number;
   
    protected img: Phaser.GameObjects.Graphics;
    protected lifeBar: LifeBar;
    protected anutoEnemy: Anuto.Enemy;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.anutoEnemy = anutoEnemy;
        this.id = this.anutoEnemy.id;
        this.type = this.anutoEnemy.type;
        this.alpha = 0;

        this.lifeBar = new LifeBar(this.scene, this.anutoEnemy.life);
        this.lifeBar.y = -32;
        this.lifeBar.x -= LifeBar.WIDTH / 2;
        this.add(this.lifeBar);

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);
    }

    public update(time: number, delta: number): void {

        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = GameVars.timeStepFactor === 4 ? .5 : .15;
        } else {
            smoothFactor = 1;
        }

        this.x += (this.anutoEnemy.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        this.y += (this.anutoEnemy.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;

        this.lifeBar.updateValue(this.anutoEnemy.life);

        // para suavizar la aparición
        if (this.alpha < 1) {
            this.alpha += GameVars.timeStepFactor === 4 ? .1 : .035;
        }
    }

    public hit(): void {

        // de momento nada
    }
}
