import { GameConstants } from "../../../GameConstants";

export class BulletActor extends Phaser.GameObjects.Image {

    public anutoBullet: Anuto.Bullet;

    constructor(scene: Phaser.Scene, anutoBullet: Anuto.Bullet) {

        super(scene, 0, 0, "texture_atlas_1", "bullet");

        this.anutoBullet = anutoBullet;

        this.x = this.anutoBullet.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoBullet.y * GameConstants.CELLS_SIZE;
    }

    public update(time: number, delta: number): void {
        
        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = .15;
        } else {
            smoothFactor = 1;
        }
        
        this.x += (this.anutoBullet.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        this.y += (this.anutoBullet.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
    }
}
