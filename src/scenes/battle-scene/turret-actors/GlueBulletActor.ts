import { GameConstants } from "../../../GameConstants";

export class GlueBulletActor extends Phaser.GameObjects.Container {

    public anutoBullet: Anuto.GlueBullet;
    public initialPosition: {x: number, y: number};

    protected img: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, anutoBullet: Anuto.GlueBullet) {

        super(scene);

        this.img = this.scene.add.sprite(0, 0, "texture_atlas_1", "bullet_3_1_1");
        this.add(this.img);

        this.anutoBullet = anutoBullet;

        this.setScale(.75);
        this.visible = false;

        this.x = this.anutoBullet.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoBullet.y * GameConstants.CELLS_SIZE;

        this.initialPosition = {x: this.x, y: this.y};

        this.img.anims.play("glue_bullet");
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
