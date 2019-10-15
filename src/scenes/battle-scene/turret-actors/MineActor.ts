import { LaunchTurretActor } from './LaunchTurretActor';
import { GameConstants } from "../../../GameConstants";
import { GameVars } from '../../../GameVars';
import { BoardContainer } from '../BoardContainer';
import * as Anuto from "../../../../engine/src";
import { AudioManager } from '../../../AudioManager';

export class MineActor extends Phaser.GameObjects.Container {

    public anutoMine: Anuto.Mine;

    private mineImage: Phaser.GameObjects.Image;
    private detonated: boolean;

    constructor(scene: Phaser.Scene, anutoMine: Anuto.Mine, launchTurretActor: LaunchTurretActor) {

        super(scene, 0, 0);

        this.anutoMine = anutoMine;
        this.detonated = false;

        let randX = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 3;
        let randY = Math.random() * GameConstants.CELLS_SIZE / 2 - GameConstants.CELLS_SIZE / 3;

        this.x = launchTurretActor.x;
        this.y = launchTurretActor.y;

        this.mineImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "mine");
        this.mineImage.setScale(.5);
        this.add(this.mineImage);

        this.scene.tweens.add({
            targets: this,
            x: this.anutoMine.x * GameConstants.CELLS_SIZE + randX,
            y: this.anutoMine.y * GameConstants.CELLS_SIZE + randY,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 600 : 200,
        });

        AudioManager.playSound("t2_mine_launcher");

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

        AudioManager.playSound("t2_mine_explosion");
    }
}
