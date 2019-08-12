import { LaunchTurretActor } from './LaunchTurretActor';
import { GameConstants } from "../../../GameConstants";
import { GameVars } from '../../../GameVars';
import { BoardContainer } from '../BoardContainer';

export class MineActor extends Phaser.GameObjects.Container {

    public anutoMine: Anuto.Mine;

    private mineImage: Phaser.GameObjects.Image;
    private detonated: boolean;

    constructor(scene: Phaser.Scene, anutoMine: Anuto.Mine, launchTurretActor: LaunchTurretActor) {

        super(scene, 0, 0);

        this.anutoMine = anutoMine;
        this.detonated = false;

        let randX = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 4;
        let randY = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 4;

        this.x = this.anutoMine.x * GameConstants.CELLS_SIZE + randX;
        this.y = this.anutoMine.y * GameConstants.CELLS_SIZE + randY;

        this.mineImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "mine");
        this.mineImage.setScale(.5);
        this.add(this.mineImage);

    }

    public update(time: number, delta: number): void {
        
        // 
    }

    public detonate(): void {

        this.detonated = true;

        this.mineImage.visible = false;
        
        let explosionEffect = this.scene.add.sprite(0, 0, "texture_atlas_1", "tower4_fx_01");
        explosionEffect.setScale(.75);
        this.add(explosionEffect);

        explosionEffect.anims.play("explosion");

        explosionEffect.on("animationcomplete", () => {
            BoardContainer.currentInstance.removeMine(this);
        }, this);
    }
}
