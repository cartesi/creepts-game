export class LifeBar extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 40;

    private bar: Phaser.GameObjects.Graphics;
    private totalLife: number;

    constructor(scene: Phaser.Scene, totalLife: number) {

        super(scene);

        this.totalLife = totalLife;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x000000);
        background.fillRect(0, 0, 40, 4);
        this.add(background);

        this.bar = new Phaser.GameObjects.Graphics(this.scene);
        this.bar.fillStyle(0x00FF00);
        this.bar.fillRect(0, 0, 40, 4);
        this.add(this.bar);
    }

    public updateValue(life: number): void {
        
        this.bar.scaleX = life / this.totalLife;
    }
}
