import { GameConstants } from "../../GameConstants";
import { BattleManager } from "./BattleManager";

export class TowerActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;

    public p: {r: number, c: number};

    private canon: Phaser.GameObjects.Graphics;
    private tower: Anuto.Tower;

    constructor(scene: Phaser.Scene, position: {r: number, c: number}) {

        super(scene);

        this.p = position;

        this.tower = BattleManager.addTower(this.p);

        this.x = GameConstants.CELLS_SIZE * (this.p.c + .5);
        this.y = GameConstants.CELLS_SIZE * (this.p.r + .5);

        const s =  GameConstants.CELLS_SIZE * .8;

        const tmpGraphics = new Phaser.GameObjects.Graphics(this.scene);
        tmpGraphics.fillStyle(0x0000FF);
        tmpGraphics.fillRect(-s / 2, -s / 2, s,  s);
        tmpGraphics.fillStyle(0xFFFFFF);
        tmpGraphics.fillCircle(0, 0, 10);
        this.add(tmpGraphics);

        this.canon = new Phaser.GameObjects.Graphics(this.scene);
        this.canon.lineStyle(2, 0x000000);
        this.canon.moveTo(0, 0);
        this.canon.lineTo(GameConstants.CELLS_SIZE * .5, 0);
        this.canon.stroke();
        this.add(this.canon);
    }

    public update(time: number, delta: number): void {
        //
    }
}
