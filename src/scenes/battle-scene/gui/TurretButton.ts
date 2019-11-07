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

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 25, "texture_atlas_1", "turret_" + (index + 1) + "_icon");
        this.base.setInteractive();
        this.base.setOrigin(.5, 1);
        this.base.on("pointerdown", this.onDownTurret, this);
        this.add(this.base);

        let creditIcon = new Phaser.GameObjects.Image(this.scene, -25, 40, "texture_atlas_1", "icon_coin_" + (index + 1));
        this.add(creditIcon);

        let color = "";

        switch (type) {
            case Anuto.GameConstants.TURRET_PROJECTILE:
                color = "#05fb2e";
                break;
            case Anuto.GameConstants.TURRET_LASER:
                color = "#ff01d8";
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                    color = "#ffed03";
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                color = "#00caeb";
                break;
            default:
        }

        let text = new Phaser.GameObjects.Text(this.scene, 8, 40, BattleManager.anutoEngine.turretData[this.turretType].price, {fontFamily: "Rubik-Regular", fontSize: "22px", color: color});
        text.setOrigin(.5);
        this.add(text);

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
