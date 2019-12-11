import { TurretActor } from './TurretActor';
import { GameVars } from "../../../GameVars";

export class TurretLevel extends Phaser.GameObjects.Container {

    private stars: Phaser.GameObjects.Image[];
    private turret: TurretActor;

    constructor(scene: Phaser.Scene, turret: TurretActor) {

        super(scene);

        this.y = 22;

        this.turret = turret;

        this.stars = [];

        let star = new Phaser.GameObjects.Image(this.scene, -22, 0, "texture_atlas_1", "star_01");
        star.setScale(1.2);
        this.add(star);
        this.stars.push(star);

        star = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "star_01");
        star.setScale(1.2);
        this.add(star);
        this.stars.push(star);

        star = new Phaser.GameObjects.Image(this.scene, 22, 0, "texture_atlas_1", "star_01");
        star.setScale(1.2);
        this.add(star);
        this.stars.push(star);
    }

    public update(): void {

        if (GameVars.paused || GameVars.semipaused || GameVars.waveOver || GameVars.turretSelectedOn || this.turret.showLevel) {

            if (!this.visible) {
                this.visible = true;
            }

            if (this.turret.turret.maxLevel === 5) {
                this.stars[0].visible = true;
                this.stars[1].visible = false;
                this.stars[2].visible = false;

                this.stars[0].x = 0;
            } else if (this.turret.turret.maxLevel === 10) {
                this.stars[0].visible = true;
                this.stars[1].visible = true;
                this.stars[2].visible = false;

                this.stars[0].x = -12;
                this.stars[1].x = 12;
            } else {
                this.stars[0].visible = true;
                this.stars[1].visible = true;
                this.stars[2].visible = true;

                this.stars[0].x = -22;
                this.stars[1].x = 0;
                this.stars[2].x = 22;
            }

            if (this.turret.turret.level <= 5) {
                this.stars[0].setFrame("star_0" + (this.turret.turret.level + 1));
                this.stars[1].setFrame("star_01");
                this.stars[2].setFrame("star_01");
            } else if (this.turret.turret.level <= 10) {
                this.stars[1].setFrame("star_0" + (this.turret.turret.level - 5 + 1));
                this.stars[0].setFrame("star_06");
                this.stars[2].setFrame("star_01");
            } else {
                this.stars[2].setFrame("star_0" + (this.turret.turret.level - 10 + 1));
                this.stars[0].setFrame("star_06");
                this.stars[1].setFrame("star_06");
            }
            
        } else {

            if (this.visible) {
                this.visible = false;
            }
        }
    }
}
