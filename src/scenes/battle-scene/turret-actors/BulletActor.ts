import { GameConstants } from "../../../GameConstants";

export class BulletActor extends Phaser.GameObjects.Image {

    public anutoBullet: Anuto.Bullet;
    public initialPosition: {x: number, y: number};

    constructor(scene: Phaser.Scene, anutoBullet: Anuto.Bullet) {

        super(scene, 0, 0, "texture_atlas_1", "bullet_1_1");

        this.anutoBullet = anutoBullet;

        this.setScale(.75);
        this.visible = false;

        this.x = this.anutoBullet.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoBullet.y * GameConstants.CELLS_SIZE;

        this.initialPosition = {x: this.x, y: this.y};
    }

    public update(time: number, delta: number): void {
        
        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = .3;
        } else {
            smoothFactor = 1;
        }

        let offX = (this.anutoBullet.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        let offY = (this.anutoBullet.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
        
        this.x += offX;
        this.y += offY;

        this.rotation = Math.atan2(offY, offX) + Math.PI / 2;

        if (!this.visible) {
            let distX = this.initialPosition.x - this.x;
            let distY = this.initialPosition.y - this.y;
            if (Math.sqrt( distX * distX + distY * distY) > 40) {
                this.visible = true;
            }
        }
    }
}
