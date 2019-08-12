import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { LaunchTurretActor } from "./LaunchTurretActor";
import { BoardContainer } from "../BoardContainer";
import { BattleManager } from "../BattleManager";

export class MortarActor extends Phaser.GameObjects.Container {

    public anutoMortar: Anuto.Mortar;

    private launchTurretActor: LaunchTurretActor;
    private mortarImage: Phaser.GameObjects.Image;
    private detonated: boolean;
    
    constructor(scene: Phaser.Scene, anutoMortar: Anuto.Mortar, launchTurretActor: LaunchTurretActor) {

        super(scene);

        this.anutoMortar = anutoMortar;
        this.launchTurretActor = launchTurretActor;
        this.detonated = false;

        this.x = this.anutoMortar.x * GameConstants.CELLS_SIZE;
        this.y = this.anutoMortar.y * GameConstants.CELLS_SIZE;

        this.mortarImage = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", anutoMortar.grade === 1 ? "granade" : "bullet_4_3");
        this.mortarImage.setScale(.5);
        this.add(this.mortarImage);

        this.rotation = Math.random() * Math.PI;

        this.visible = false;
    }

    public update(time: number, delta: number): void {

        if (this.detonated) {
            return;
        }

        // hacerla visible una vez haya pasado la boca del cañón
        if (!this.visible) {

            let d = Math.sqrt((this.x - this.launchTurretActor.x) * (this.x - this.launchTurretActor.x) + (this.x - this.launchTurretActor.x) * (this.x - this.launchTurretActor.x));

            // la longitud del cañón más un poco más debido al diámetro del mortero 
            if (d > this.launchTurretActor.canonLength) {
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
            smoothFactor = GameVars.timeStepFactor === 4 ? .65 : .2;
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
    }

    public detonate(): void {

        this.detonated = true;

        this.mortarImage.visible = false;

        let explosionEffect = this.scene.add.sprite(0, 0, "texture_atlas_1", "tower4_fx_01");
        explosionEffect.setScale(.75);
        this.add(explosionEffect);

        explosionEffect.anims.play("explosion");

        explosionEffect.on("animationcomplete", () => {
            BoardContainer.currentInstance.removeMortar(this);
        }, this);
    }
}
