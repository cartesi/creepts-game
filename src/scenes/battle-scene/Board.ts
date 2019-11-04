import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class Board extends Phaser.GameObjects.Container {

    public pathContainer: Phaser.GameObjects.Container;
    public boardMatrix: number[][];

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = - GameConstants.CELLS_SIZE * GameVars.currentMapData.size.c / 2;
        this.y = - GameConstants.CELLS_SIZE * GameVars.currentMapData.size.r / 2;

        this.pathContainer = new Phaser.GameObjects.Container(this.scene);
        this.add(this.pathContainer);

        this.boardMatrix = new Array(GameVars.currentMapData.size.r);
        for (let i = 0; i < this.boardMatrix.length; i++) {
            if (GameVars.plateausCells.length === 0) {
                this.boardMatrix[i] = new Array(GameVars.currentMapData.size.c).fill(2);
            } else {
                this.boardMatrix[i] = new Array(GameVars.currentMapData.size.c).fill(0);
            }  
        }

        for (let i = 0; i < GameVars.plateausCells.length; i++) {
            this.boardMatrix[GameVars.plateausCells[i].r][GameVars.plateausCells[i].c] = 2;
        }

        for (let i = 0; i < GameVars.enemiesPathCells.length; i++) {

            if (GameVars.enemiesPathCells[i].c < 0 || GameVars.enemiesPathCells[i].r < 0 || GameVars.enemiesPathCells[i].c >= GameVars.currentMapData.size.c || GameVars.enemiesPathCells[i].r >= GameVars.currentMapData.size.r) {
                continue;
            }

            this.boardMatrix[GameVars.enemiesPathCells[i].r][GameVars.enemiesPathCells[i].c] = 1;
        }

        for (let i = 0; i < this.boardMatrix.length; i++) {
            for (let j = 0; j < this.boardMatrix[i].length; j++) {
                if (this.boardMatrix[i][j] === 1) {
                    let path = new Phaser.GameObjects.Graphics(this.scene);
                    path.fillStyle(0x000018);
                    path.fillRect(GameConstants.CELLS_SIZE * j, GameConstants.CELLS_SIZE * i, GameConstants.CELLS_SIZE, GameConstants.CELLS_SIZE);
                    this.pathContainer.add(path);
                } else if (this.boardMatrix[i][j] === 2) {
                    let img = new Phaser.GameObjects.Image(this.scene, GameConstants.CELLS_SIZE * j + GameConstants.CELLS_SIZE / 2, GameConstants.CELLS_SIZE * i + GameConstants.CELLS_SIZE / 2, "texture_atlas_1", this.selectTypeCell(i, j));
                    this.add(img);
                }
            }
        }
    }

    public sendActorBack(actor: any): void {

        this.sendToBack(actor);
        this.sendToBack(this.pathContainer);
    }

    private selectTypeCell(i: number, j: number): string {

        let boarderCells = [0, 0, 0, 0, 0, 0, 0, 0];

        if (this.boardMatrix[i - 1] && this.boardMatrix[i - 1][j] && this.boardMatrix[i - 1][j] === 2) {
            boarderCells[0] = 1;
        }

        if (this.boardMatrix[i - 1] && this.boardMatrix[i - 1][j + 1] && this.boardMatrix[i - 1][j + 1] === 2) {
            boarderCells[1] = 1;
        }

        if (this.boardMatrix[i] && this.boardMatrix[i][j + 1] && this.boardMatrix[i][j + 1] === 2) {
            boarderCells[2] = 1;
        }

        if (this.boardMatrix[i + 1] && this.boardMatrix[i + 1][j + 1] && this.boardMatrix[i + 1][j + 1] === 2) {
            boarderCells[3] = 1;
        }

        if (this.boardMatrix[i + 1] && this.boardMatrix[i + 1][j] && this.boardMatrix[i + 1][j] === 2) {
            boarderCells[4] = 1;
        }

        if (this.boardMatrix[i + 1] && this.boardMatrix[i + 1][j - 1] && this.boardMatrix[i + 1][j - 1] === 2) {
            boarderCells[5] = 1;
        }

        if (this.boardMatrix[i] && this.boardMatrix[i][j - 1] && this.boardMatrix[i][j - 1] === 2) {
            boarderCells[6] = 1;
        }

        if (this.boardMatrix[i - 1] && this.boardMatrix[i - 1][j - 1] && this.boardMatrix[i - 1][j - 1] === 2) {
            boarderCells[7] = 1;
        }

        let cellName = "celda_";

        if (boarderCells[0] === 0 && boarderCells[2] === 0 && boarderCells[4] === 0 && boarderCells[6] === 0) {
            cellName += "01";
        } else if (boarderCells[0] === 0 && boarderCells[2] === 0 && boarderCells[6] === 0) {
            cellName += "03";
        } else if (boarderCells[0] === 0 && boarderCells[2] === 0 && boarderCells[4] === 0) {
            cellName += "04";
        } else if (boarderCells[6] === 0 && boarderCells[2] === 0 && boarderCells[4] === 0) {
            cellName += "05";
        } else if (boarderCells[6] === 0 && boarderCells[0] === 0 && boarderCells[4] === 0) {
            cellName += "06";
        } else if (boarderCells[0] === 0 && boarderCells[2] === 0) {
            if (boarderCells[5] === 1) {
                cellName += "07";
            } else {
                cellName += "38";
            }
        } else if (boarderCells[0] === 0 && boarderCells[6] === 0) {
            if (boarderCells[3] === 1) {
                cellName += "08";
            } else {
                cellName += "41";
            }
        } else if (boarderCells[2] === 0 && boarderCells[4] === 0) {
            if (boarderCells[7] === 1) {
                cellName += "09";
            } else {
                cellName += "39";
            }
        } else if (boarderCells[6] === 0 && boarderCells[4] === 0) {
            if (boarderCells[1] === 1) {
                cellName += "10";
            } else {
                cellName += "40";
            }
        } else if (boarderCells[0] === 0 && boarderCells[4] === 0) {
            cellName += "11";
        } else if (boarderCells[2] === 0 && boarderCells[6] === 0) {
            cellName += "12";
        } else if (boarderCells[6] === 0) {
            if (boarderCells[1] === 0 && boarderCells[3] === 0) {
                cellName += "45";
            } else if (boarderCells[1] === 0) {
                cellName += "35";
            } else if (boarderCells[3] === 0) {
                cellName += "36";
            } else {
                cellName += "13";
            }
            
        } else if (boarderCells[0] === 0) {
            if (boarderCells[5] === 0 && boarderCells[3] === 0) {
                cellName += "42";
            } else if (boarderCells[5] === 0) {
                cellName += "30";
            } else if (boarderCells[3] === 0) {
                cellName += "37";
            } else {
                cellName += "14";
            }
        } else if (boarderCells[2] === 0) {
            if (boarderCells[5] === 0 && boarderCells[7] === 0) {
                cellName += "43";
            } else if (boarderCells[5] === 0) {
                cellName += "31";
            } else if (boarderCells[7] === 0) {
                cellName += "32";
            } else {
                cellName += "15";
            }
        } else if (boarderCells[4] === 0) {
            if (boarderCells[1] === 0 && boarderCells[7] === 0) {
                cellName += "44";
            } else if (boarderCells[1] === 0) {
                cellName += "34";
            } else if (boarderCells[7] === 0) {
                cellName += "33";
            } else {
                cellName += "16";
            }
            
        } else if (boarderCells[1] === 0 && boarderCells[3] === 0 && boarderCells[5] === 0 && boarderCells[7] === 0) {
            cellName += "17";
        } else if (boarderCells[3] === 0 && boarderCells[5] === 0 && boarderCells[7] === 0) {
            cellName += "18";
        } else if (boarderCells[5] === 0 && boarderCells[1] === 0 && boarderCells[7] === 0) {
            cellName += "19";
        } else if (boarderCells[3] === 0 && boarderCells[1] === 0 && boarderCells[7] === 0) {
            cellName += "20";
        } else if (boarderCells[3] === 0 && boarderCells[1] === 0 && boarderCells[5] === 0) {
            cellName += "21";
        } else if (boarderCells[3] === 0 && boarderCells[5] === 0) {
            cellName += "22";
        } else if (boarderCells[7] === 0 && boarderCells[5] === 0) {
            cellName += "23";
        } else if (boarderCells[7] === 0 && boarderCells[1] === 0) {
            cellName += "24";
        } else if (boarderCells[3] === 0 && boarderCells[1] === 0) {
            cellName += "25";
        } else if (boarderCells[5] === 0) {
            cellName += "26";
        } else if (boarderCells[7] === 0) {
            cellName += "27";
        } else if (boarderCells[1] === 0) {
            cellName += "28";
        } else if (boarderCells[3] === 0) {
            cellName += "29";
        } else {
            cellName += "02";
        }
        return cellName;
    }
}
