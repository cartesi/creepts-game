import { GameConstants } from "../../../GameConstants";
import * as Creepts from "../../../../engine/src";

export class BulletActor extends Phaser.GameObjects.Image {

    public bullet: Creepts.Bullet;
    public initialPosition: {x: number, y: number};
    public realX: number;
    public realY: number;

    constructor(scene: Phaser.Scene, bullet: Creepts.Bullet) {

        super(scene, 0, 0, "texture_atlas_1", "bullet_1_1");

        this.bullet = bullet;

        this.setScale(.75);
        this.setOrigin(.5, 0);
        this.visible = false;

        this.x = this.bullet.x * GameConstants.CELLS_SIZE;
        this.y = this.bullet.y * GameConstants.CELLS_SIZE;

        this.realX = this.x;
        this.realY = this.y;

        this.initialPosition = {x: this.x, y: this.y};
    }

    public update(time: number, delta: number): void {
        
        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = .3;
        } else {
            smoothFactor = 1;
        }

        let offX = (this.bullet.x * GameConstants.CELLS_SIZE - this.realX) * smoothFactor;
        let offY = (this.bullet.y * GameConstants.CELLS_SIZE - this.realY) * smoothFactor;
        
        this.realX += offX;
        this.realY += offY;

        this.rotation = Math.atan2(offY, offX) + Math.PI / 2;

        let canonX = 0;
        let canonY = 0;

        if (this.bullet.canonShoot === "left") {
            canonX = Math.cos(this.rotation) * 7.5;
            canonY = Math.sin(this.rotation) * 7.5;
        } else if (this.bullet.canonShoot === "right") {
            canonX = Math.cos(this.rotation) * -7.5;
            canonY = Math.sin(this.rotation) * -7.5;
        }

        this.x = this.realX + canonX;
        this.y = this.realY + canonY;

        if (!this.visible) {
            let distX = this.initialPosition.x - this.x;
            let distY = this.initialPosition.y - this.y;
            if (Math.sqrt( distX * distX + distY * distY) > 45) {
                this.visible = true;
            }
        }
    }
}
