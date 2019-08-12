import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class Board extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.c / 2;
        this.y = - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.r / 2;

        let map = [ [ "08", "14", "07", "00", "06", "11", "11", "30", "14", "07"],
                    [ "13", "02", "15", "00", "00", "00", "00", "13", "02", "15"],
                    [ "13", "02", "28", "37", "11", "04", "00", "13", "02", "15"],
                    [ "13", "02", "02", "15", "00", "00", "00", "13", "02", "15"],
                    [ "13", "02", "02", "15", "00", "08", "14", "27", "02", "15"],
                    [ "13", "02", "02", "15", "00", "13", "02", "02", "02", "15"],
                    [ "13", "02", "02", "15", "00", "13", "02", "02", "02", "15"],
                    [ "13", "02", "02", "15", "00", "13", "02", "02", "02", "15"],
                    [ "13", "02", "02", "15", "00", "13", "02", "02", "02", "15"],
                    [ "36", "16", "16", "09", "00", "13", "02", "02", "02", "15"],
                    [ "12", "00", "00", "00", "00", "13", "02", "02", "02", "15"],
                    [ "12", "00", "06", "11", "11", "33", "16", "16", "16", "31"],
                    [ "12", "00", "00", "00", "00", "00", "00", "00", "00", "12"],
                    [ "35", "14", "14", "14", "14", "14", "14", "07", "00", "12"],
                    [ "10", "16", "16", "16", "16", "16", "16", "09", "00", "05"]];

        for (let i = 0; i < GameConstants.BOARD_SIZE.c; i ++) {
            for (let j = 0; j < GameConstants.BOARD_SIZE.r; j ++) {

                if (map[j][i] !== "00") {
                    let img = new Phaser.GameObjects.Image(this.scene, GameConstants.CELLS_SIZE * i + GameConstants.CELLS_SIZE / 2, GameConstants.CELLS_SIZE * j + GameConstants.CELLS_SIZE / 2, "texture_atlas_1", "celda_" + map[j][i]);
                    this.add(img);
                }
            }
        }
    }

    public sendActorBack(actor: any): void {

        this.sendToBack(actor);
    }
}
