import { GameVars } from "../../../GameVars";

export class LifeBar extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 43;

    private bar: Phaser.GameObjects.Image;
    private totalLife: number;

    constructor(scene: Phaser.Scene, totalLife: number) {

        super(scene);

        this.totalLife = totalLife;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x000000);
        background.fillRect(0, 0, 40, 4);
        this.add(background);

        this.bar = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "life_bar_1");
        this.bar.setOrigin(0);
        this.add(this.bar);

        this.visible = false;
    }

    public updateValue(life: number): void {

        let num = 41 - Math.round((life / this.totalLife) * 40);
        this.bar.setFrame("life_bar_" + Math.min(num, 40));
        
        // this.bar.scaleX = life / this.totalLife;
    }
}
