import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class Board extends Phaser.GameObjects.Container {

    public pathContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = - GameConstants.CELLS_SIZE * GameVars.currentMapData.size.c / 2;
        this.y = - GameConstants.CELLS_SIZE * GameVars.currentMapData.size.r / 2;

        this.pathContainer = new Phaser.GameObjects.Container(this.scene);
        this.add(this.pathContainer);

        // TODO: cambiar esto para pillar bien las imagenes con los bordes
        for (let i = 0; i < GameVars.currentMapData.size.c; i ++) {
            for (let j = 0; j < GameVars.currentMapData.size.r; j ++) {

                let isPath = false;

                for (let k = 0; k < GameVars.enemiesPathCells.length; k++) {
                    if (GameVars.enemiesPathCells[k].c === i && GameVars.enemiesPathCells[k].r === j) {
                        isPath = true;
                        break;
                    }
                }

                if (!isPath) {
                    let img = new Phaser.GameObjects.Image(this.scene, GameConstants.CELLS_SIZE * i + GameConstants.CELLS_SIZE / 2, GameConstants.CELLS_SIZE * j + GameConstants.CELLS_SIZE / 2, "texture_atlas_1", "celda_02");
                    this.add(img);
                } else {
                    let path = new Phaser.GameObjects.Graphics(this.scene);
                    path.fillStyle(0x555555);
                    path.fillRect(GameConstants.CELLS_SIZE * i, GameConstants.CELLS_SIZE * j, GameConstants.CELLS_SIZE, GameConstants.CELLS_SIZE);
                    this.pathContainer.add(path);
                }
            }
        }
    }

    public sendActorBack(actor: any): void {

        this.sendToBack(actor);
        this.sendToBack(this.pathContainer);
    }
}
