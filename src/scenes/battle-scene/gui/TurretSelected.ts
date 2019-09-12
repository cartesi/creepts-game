import { BattleManager } from './../BattleManager';
import { GameConstants } from './../../../GameConstants';
import { GUI } from './GUI';
import { GameVars } from '../../../GameVars';
export class TurretSelected extends Phaser.GameObjects.Container {

    private base: Phaser.GameObjects.Image;
    private canon: Phaser.GameObjects.Image;

    private gui: GUI;

    private turretType: string;
    private offY: number;
    private prevWorldY: number;

    constructor(scene: Phaser.Scene, type: string, gui: GUI) {

        super(scene);

        this.prevWorldY = 0;

        if (this.scene.sys.game.device.os.desktop) {
            this.offY = 0;
        } else {
            this.offY = -30;
        }
        

        let base_name;
        let canon_name;

        this.turretType = type;
        this.gui = gui;

        let range = GameConstants.CELLS_SIZE;

        switch (type) {

            case Anuto.GameConstants.TURRET_PROJECTILE:
                base_name = "base_1_1";
                canon_name = "canon_1_1_1";
                range *= 2.5;
                break;
            case Anuto.GameConstants.TURRET_LASER:
                base_name = "base_2_1";
                canon_name = "canon_2_1_1";
                range *= 3.05;
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                base_name = "base_4_1";
                canon_name = "canon_4_1_3";
                range *= 2.5;
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                base_name = "base_3_1";
                range *= 1.5;
                break;
            default:
        }

        this.base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", base_name);
        this.add(this.base);

        if (type !== Anuto.GameConstants.TURRET_GLUE) {
            this.canon = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", canon_name);
            this.add(this.canon);
        }

        let rangeCircle = new Phaser.GameObjects.Graphics(this.scene);
        rangeCircle.setPosition(0, 0);
        rangeCircle.lineStyle(2, 0x00FF00);
        rangeCircle.strokeCircle(0, 0, range);
        this.add(rangeCircle);

        this.scene.sys.updateList.add(this);

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => { this.onPointerUp(pointer); }, this);
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); }, this);
        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => { this.onPointerMove(pointer); }, this);
        
    }

    public preUpdate(time: number, delta: number): void {

        // 
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {

        if (!this.scene.sys.game.device.os.desktop) {
            if (this.prevWorldY > GameConstants.GAME_HEIGHT / 4 && pointer.worldY <= GameConstants.GAME_HEIGHT / 4) {
                this.offY = -60;
            } else if (this.prevWorldY < GameConstants.GAME_HEIGHT * (3 / 4) && pointer.worldY >= GameConstants.GAME_HEIGHT * (3 / 4)) {
                this.offY = 60;
            }
        }

        this.setPosition(pointer.x, (pointer.y + this.offY) / GameVars.scaleY);
        this.prevWorldY = pointer.worldY;
    }

    private onPointerUp(pointer: Phaser.Input.Pointer): void {

        let posX = (pointer.x - GameConstants.GAME_WIDTH / 2) / GameVars.scaleCorrectionFactor + ((GameVars.currentMapData.size.c * GameConstants.CELLS_SIZE) / 2);
        let posY = ((pointer.y + this.offY) - GameConstants.GAME_HEIGHT / 2 - GameConstants.CELLS_SIZE) / (GameVars.scaleCorrectionFactor * GameVars.scaleY) + ((GameVars.currentMapData.size.r * GameConstants.CELLS_SIZE) / 2);

        let c = Math.floor(posX / GameConstants.CELLS_SIZE);
        let r = Math.floor(posY / GameConstants.CELLS_SIZE);

        BattleManager.addTurretToScene(this.turretType, {r: r, c: c});
        
        this.scene.input.removeAllListeners();
        this.gui.removeTurret();
    }
}
