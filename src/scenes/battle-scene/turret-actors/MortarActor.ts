import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class MortarActor extends Phaser.GameObjects.Image {

    public anutoMortar: Anuto.Mortar;

    constructor(scene: Phaser.Scene, anutoMortar: Anuto.Mortar) {

        super(scene, 0, 0, "texture_atlas_1", "mortar");

        this.anutoMortar = anutoMortar;

        this.x = this.anutoMortar.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoMortar.y * GameConstants.CELLS_SIZE;
    }

    public update(time: number, delta: number): void {
        
        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = GameVars.timeStepFactor === 4 ? .65 : .2;
        } else {
            smoothFactor = 1;
        }
        
        this.x += (this.anutoMortar.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        this.y += (this.anutoMortar.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;
    }
}
