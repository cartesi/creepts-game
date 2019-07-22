import { GameConstants } from "../../../GameConstants";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";

export class TowerActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;
    public p: {r: number, c: number};

    private canon: Phaser.GameObjects.Graphics;
    private anutoTower: Anuto.Tower;
    private rangeCircle: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, type: string, position: {r: number, c: number}) {

        super(scene);

        this.id = GameVars.towerData.towers[type].id;
        this.p = position;

        this.anutoTower = BattleManager.addTower(type, this.p);

        this.x = GameConstants.CELLS_SIZE * (this.p.c + .5);
        this.y = GameConstants.CELLS_SIZE * (this.p.r + .5);

        const tmpImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "tmp-tower");
        tmpImage.setScale(GameConstants.CELLS_SIZE / tmpImage.width * .8);
        tmpImage.setInteractive();
        tmpImage.on("pointerdown", this.onDownTower, this);
        this.add(tmpImage);

        this.canon = new Phaser.GameObjects.Graphics(this.scene);
        this.canon.lineStyle(3, 0x000000);
        this.canon.moveTo(0, 0);
        this.canon.lineTo(GameConstants.CELLS_SIZE * .5, 0);
        this.canon.stroke();
        this.add(this.canon);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.rangeCircle = new Phaser.GameObjects.Graphics(this.scene);
            this.rangeCircle.lineStyle(2, 0x00FF00);
            this.rangeCircle.strokeCircle(0, 0, this.anutoTower.range * GameConstants.CELLS_SIZE);
            this.add(this.rangeCircle);
        }
    }

    public update(time: number, delta: number): void {
        //
    }

    public shoot(): void {
        //
    }

    private onDownTower(): void {
        //
    }
}
