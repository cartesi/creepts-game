export class BulletActor extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, "texture_atlas_1", "bullet");
    }

    public update(time: number, delta: number): void {
        //
    }
}
