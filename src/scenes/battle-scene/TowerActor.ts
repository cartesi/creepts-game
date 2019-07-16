
export class TowerActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;

    constructor(scene: Phaser.Scene, id: number) {

        super(scene);

        this.id = id;
    }

    public update(time: number, delta: number): void {
        //
    }
}
