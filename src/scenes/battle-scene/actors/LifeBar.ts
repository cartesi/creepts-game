export class LifeBar extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 40;

    private bar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFF000);
        background.fillRect(0, 0, 40, 4);
        this.add(background);

        this.bar = new Phaser.GameObjects.Graphics(this.scene);
        this.bar.fillStyle(0xFF000);
        this.bar.fillRect(0, 0, 40, 4);
        this.add( this.bar);
    }

    public updateValue(value: number): void {
        //
    }
}
