import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { BoardContainer } from "../BoardContainer";
import { BattleManager } from "../BattleManager";
import { AudioManager } from "../../../AudioManager";
import * as Anuto from "../../../../engine/src";

export class MortarActor extends Phaser.GameObjects.Container {

    public anutoMortar: Anuto.Mortar;

    private mortarImage: Phaser.GameObjects.Image;
    private detonated: boolean;
    private initialPosition: {x: number, y: number};
    private deltaAngle: number;
    
    constructor(scene: Phaser.Scene, anutoMortar: Anuto.Mortar) {

        super(scene);

        this.anutoMortar = anutoMortar;
        this.detonated = false;

        this.x = this.anutoMortar.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoMortar.y * GameConstants.CELLS_SIZE;

        this.initialPosition = {x: this.x, y: this.y};

        this.mortarImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", anutoMortar.grade === 1 ? "granade" : "bullet_4_3");
        this.mortarImage.setScale(.5);
        this.add(this.mortarImage);

        this.rotation = Math.random() * Math.PI;

        this.visible = false;

        this.deltaAngle = Math.random() > .5 ? .5 : -.5;

        if (this.anutoMortar.grade === 1) {
            AudioManager.playSound("t1_cannon");
        } else {
            AudioManager.playSound("t3_missile_launcher");
        }
    }

    public update(time: number, delta: number): void {

        if (this.detonated) {
            return;
        }

        // hacerla visible una vez haya pasado la boca del cañón
        if (!this.visible) {
            let distX = this.initialPosition.x - this.x;
            let distY = this.initialPosition.y - this.y;
            if (Math.sqrt( distX * distX + distY * distY) > 30) {
                this.visible = true;
            }
        }

        // cambiar la escala para dar la sensacion de altura
        const tick = BattleManager.anutoEngine.ticksCounter;
        const dt = tick - this.anutoMortar.creationTick;
        let scale: number;

        // la escala crece
        if (dt < this.anutoMortar.ticksToImpact / 2) {
            scale = .75 * ( 1 + dt / (this.anutoMortar.ticksToImpact / 2));
        } else {
            // la escala disminuye
            scale = .75 * ( 1 +  (this.anutoMortar.ticksToImpact - dt) / (this.anutoMortar.ticksToImpact / 2)); 
        }

        this.mortarImage.setScale(scale);

        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = GameVars.timeStepFactor === 1 ? .2 : .65;
        } else {
            smoothFactor = 1;
        }

        let offX = (this.anutoMortar.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        let offY = (this.anutoMortar.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;

        this.x += offX;
        this.y += offY; 

        if (this.anutoMortar.grade === 3) {
            this.rotation = Math.atan2(offY, offX) + Math.PI / 2;
        } 

        if (this.anutoMortar.grade === 1) {
            this.mortarImage.angle += this.deltaAngle;
        }
    }

    public detonate(): void {

        this.visible = true;
        this.detonated = true;
        this.mortarImage.visible = false;

        const explosionEffect = this.scene.add.sprite(0, 0, "texture_atlas_1", "tower4_fx_01");
        if (this.anutoMortar.turret.grade === 1) {
            explosionEffect.setScale(.5);
            AudioManager.playSound("t1_explosion");
        } else if (this.anutoMortar.turret.grade === 3) {
            explosionEffect.setScale(.75);
            AudioManager.playSound("t2_mine_explosion");
        }
        this.add(explosionEffect);

        explosionEffect.anims.play("explosion");

        explosionEffect.on("animationcomplete", () => {
            BoardContainer.currentInstance.removeMortar(this);
        }, this);

        
    }
}
