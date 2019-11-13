import { GameVars } from "../../../GameVars";
import * as Anuto from "../../../../engine/src";

export class TurretLevel extends Phaser.GameObjects.Container {

    private text: Phaser.GameObjects.Text;
    private anutoTurret: Anuto.Turret;

    constructor(scene: Phaser.Scene, turret: Anuto.Turret) {

        super(scene);

        this.anutoTurret = turret;

        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, "", {fontFamily: "Rubik-Regular", fontSize: "40px", color: "#00ff00"});
        this.text.visible = false;
        this.text.setStroke("#000000", 10);
        this.text.setOrigin(.5);
        this.add(this.text);
    }

    public update(): void {

        if (GameVars.paused || GameVars.semipaused || GameVars.waveOver || GameVars.turretSelectedOn) {

            if (!this.text.visible) {
                this.text.visible = true;
            }

            this.text.setText(this.anutoTurret.level.toString());
        } else {

            if (this.text.visible) {
                this.text.visible = false;
            }
        }
    }
}
