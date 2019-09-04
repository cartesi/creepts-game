import { GameConstants } from "../../GameConstants";
import { GameManager } from "../../GameManager";
import { GameVars } from "../../GameVars";

export class MapInfo extends Phaser.GameObjects.Container {

    public back: Phaser.GameObjects.Graphics;
    public downY: number;

    private index: number;

    constructor(scene: Phaser.Scene, mapObject: MapObject, index: number) {

        super(scene);

        this.index = index;

        this.back = new Phaser.GameObjects.Graphics(this.scene);
        this.back.lineStyle(4, 0x000000);
        this.back.strokeRect(-140, 0, 280, 330);
        this.back.setInteractive(new Phaser.Geom.Rectangle(-140, 0, 280, 330), Phaser.Geom.Rectangle.Contains);
        this.back.on("pointerdown", (pointer: Phaser.Input.Pointer) => { this.onPointerDown(pointer); });
        this.back.on("pointerup", (pointer: Phaser.Input.Pointer) => { this.onPointerUp(pointer); });
        this.back.on("pointerout", () => { this.onPointerOut(); });
        this.back.on("pointermove", () => { this.onPointerOut(); });
        this.add(this.back);

        let title = new Phaser.GameObjects.Text(this.scene, 0, 5, mapObject.name, {fontFamily: "Rubik-Regular", fontSize: "30px", color: "#000000"});
        title.setOrigin(.5, 0);
        this.add(title);

        let score = new Phaser.GameObjects.Text(this.scene, 0, 40, "Score: " + GameVars.formatNumber(GameVars.gameData.scores[index]), {fontFamily: "Rubik-Regular", fontSize: "25px", color: "#000000"});
        score.setOrigin(.5, 0);
        this.add(score);

        let scalePath = .25;

        if (mapObject.plateaus.length === 0) {
            let pathBack = new Phaser.GameObjects.Graphics(this.scene);
            pathBack.setPosition(-(mapObject.size.c / 2) * GameConstants.CELLS_SIZE * scalePath, 85);
            pathBack.fillStyle(0x999999);
            pathBack.fillRect(0, 0, mapObject.size.c * GameConstants.CELLS_SIZE * scalePath, mapObject.size.r * GameConstants.CELLS_SIZE * scalePath);
            this.add(pathBack);
        } else {
            for (let i = 0; i < mapObject.plateaus.length; i++) {
                let path = new Phaser.GameObjects.Graphics(this.scene);
                path.setPosition(-(mapObject.size.c / 2) * GameConstants.CELLS_SIZE * scalePath, 85);
                path.fillStyle(0x999999);
                path.fillRect(GameConstants.CELLS_SIZE * scalePath * mapObject.plateaus[i].c, GameConstants.CELLS_SIZE * scalePath * mapObject.plateaus[i].r, GameConstants.CELLS_SIZE * scalePath, GameConstants.CELLS_SIZE * scalePath);
                this.add(path);
            }
        }
        

        for (let i = 0; i < mapObject.path.length; i++) {

            if (mapObject.path[i].c === -1 || mapObject.path[i].r === -1 || mapObject.path[i].c === mapObject.size.c || mapObject.path[i].r === mapObject.size.r) {
                continue;
            }

            let path = new Phaser.GameObjects.Graphics(this.scene);
            path.setPosition(-(mapObject.size.c / 2) * GameConstants.CELLS_SIZE * scalePath, 85);
            path.fillStyle(0x000000);
            path.fillRect(GameConstants.CELLS_SIZE * scalePath * mapObject.path[i].c, GameConstants.CELLS_SIZE * scalePath * mapObject.path[i].r, GameConstants.CELLS_SIZE * scalePath, GameConstants.CELLS_SIZE * scalePath);
            this.add(path);
        }
    }

    private onPointerDown(pointer: Phaser.Input.Pointer): void {

        this.downY = pointer.worldY;

        this.back.clear();
        this.back.fillStyle(0xDDDDDD);
        this.back.fillRect(-140, 0, 280, 330);
        this.back.lineStyle(4, 0x000000);
        this.back.strokeRect(-140, 0, 280, 330);
    }

    private onPointerUp(pointer: Phaser.Input.Pointer): void {

        this.onPointerOut();

        if (this.downY === pointer.worldY) {
            GameManager.mapSelected(this.index);
        }
    }

    private onPointerOut(): void {

        this.back.clear();
        this.back.fillStyle(0xFFFFFF);
        this.back.fillRect(-140, 0, 280, 330);
        this.back.lineStyle(4, 0x000000);
        this.back.strokeRect(-140, 0, 280, 330);
    }
}
