import { BattleManager } from "./../BattleManager";
import { GameVars } from "../../../GameVars";
import * as Anuto from "../../../../engine/src";

export class TurretButton extends Phaser.GameObjects.Container {

    private base: Phaser.GameObjects.Image;
    private canon: Phaser.GameObjects.Image;

    private turretType: string;

    constructor(scene: Phaser.Scene, type: string, index: number) {

        super(scene);

        this.x = index * 80;
        this.turretType = type;

        this.setScale(.8);

        let base_name;
        let canon_name;

        switch (type) {

            case Anuto.GameConstants.TURRET_PROJECTILE:
                base_name = "base_1_1";
                canon_name = "canon_1_1_1";
                break;
            case Anuto.GameConstants.TURRET_LASER:
                base_name = "base_2_1";
                canon_name = "canon_2_1_1";
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                base_name = "base_4_1";
                canon_name = "canon_4_1_3";
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                base_name = "base_3_1";
                break;
            default:
        }

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", base_name);
        this.base.setInteractive();
        this.base.on("pointerdown", this.onDownTurret, this);
        this.add(this.base);

        if (type !== Anuto.GameConstants.TURRET_GLUE) {
            this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", canon_name);
            this.add(this.canon);
        }

        if (type === Anuto.GameConstants.TURRET_LASER) {
            this.base.y += 6;
            this.canon.y += 6;
        }

        let creditIcon = new Phaser.GameObjects.Image(this.scene, -30, 42, "texture_atlas_1", "coin_icon_2");
        this.add(creditIcon);

        let text = new Phaser.GameObjects.Text(this.scene, 12, 42, BattleManager.anutoEngine.turretData[this.turretType].price, {fontFamily: "Rubik-Light", fontSize: "30px", color: "#000000"});
        text.setOrigin(.5);
        this.add(text);

        if (this.turretType === Anuto.GameConstants.TURRET_GLUE) {
            text.x = 15;
        }

        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        if (BattleManager.anutoEngine.turretData[this.turretType].price > BattleManager.anutoEngine.credits) {
            if (this.alpha !== .5) {
                this.alpha = .5;
            }
        } else {
            if (this.alpha !== 1) {
                this.alpha = 1;
            }
        }
    }

    private onDownTurret(): void {

        if (this.alpha !== 1 || GameVars.paused || BattleManager.anutoEngine.gameOver) {
            return;
        }

        BattleManager.createTurret(this.turretType);
    }
}
