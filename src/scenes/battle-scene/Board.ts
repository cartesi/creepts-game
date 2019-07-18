import { GameConstants } from "../../GameConstants";

export class Board extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const tmpGraphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(tmpGraphics);

        tmpGraphics.lineStyle(1, 0x000000);

        // graficos temporales
        for (let i = 0; i < GameConstants.BOARD_SIZE.r + 1; i ++) {
            tmpGraphics.moveTo(0, i * GameConstants.CELLS_SIZE);
            tmpGraphics.lineTo(GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.r, i * GameConstants.CELLS_SIZE);
            tmpGraphics.stroke();
        }

        for (let i = 0; i < GameConstants.BOARD_SIZE.c + 1; i ++) {
            tmpGraphics.moveTo(i * GameConstants.CELLS_SIZE, 0);
            tmpGraphics.lineTo(i * GameConstants.CELLS_SIZE, GameConstants.BOARD_SIZE.r * GameConstants.CELLS_SIZE);
            tmpGraphics.stroke();
        }
    }
}
