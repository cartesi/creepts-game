import { GameConstants } from "../../../GameConstants";
import * as Creepts from "../../../../engine/src";

export class GlueBulletActor extends Phaser.GameObjects.Container {

    public glueBullet: Creepts.GlueBullet;
    public initialPosition: {x: number, y: number};

    private img: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, glueBullet: Creepts.GlueBullet) {

        super(scene);

        this.img = this.scene.add.sprite(0, 0, "texture_atlas_1", "bullet_fx_3");
        this.img.setOrigin(.5, 1);
        this.img.setScale(.25);
        this.add(this.img);

        this.glueBullet = glueBullet;

        this.visible = false;

        this.x = this.glueBullet.x * GameConstants.CELLS_SIZE;
        this.y = this.glueBullet.y * GameConstants.CELLS_SIZE;

        this.initialPosition = {x: this.x, y: this.y};
    }

    public update(time: number, delta: number): void {
        
        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = .3;
        } else {
            smoothFactor = 1;
        }

        const offX = (this.glueBullet.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        const offY = (this.glueBullet.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
        
        this.x += offX;
        this.y += offY;

        this.rotation = Math.atan2(offY, offX) + Math.PI * .5;

        if (!this.visible) {
            const distX = this.initialPosition.x - this.x;
            const distY = this.initialPosition.y - this.y;
            if (Math.sqrt( distX * distX + distY * distY) > 20) {
                this.visible = true;
            }
        }
    }
}
