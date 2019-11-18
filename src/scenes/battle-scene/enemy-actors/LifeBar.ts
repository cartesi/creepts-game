import { GameVars } from "../../../GameVars";

export class LifeBar extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 43;

    private bar: Phaser.GameObjects.Image;
    private totalLife: number;

    constructor(scene: Phaser.Scene, totalLife: number) {

        super(scene);

        this.totalLife = totalLife;

        this.bar = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "life_bar_1");
        this.bar.setOrigin(0);
        this.add(this.bar);

        this.visible = false;
    }

    public updateValue(life: number): void {

        let num = Math.round((life / this.totalLife) * 40);
        this.bar.setFrame("life_bar_" + Math.max(num, 1));
        
        // this.bar.scaleX = life / this.totalLife;
    }
}
