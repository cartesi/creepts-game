import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { LifeBar } from "./LifeBar";
import * as Creepts from "../../../../engine/src";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;
    public id: number;
   
    protected img: Phaser.GameObjects.Sprite;
    protected shield: Phaser.GameObjects.Image;
    protected lifeBar: LifeBar;
    protected enemy: Creepts.Enemy;

    constructor(scene: Phaser.Scene, enemy: Creepts.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.enemy = enemy;
        this.id = this.enemy.id;
        this.type = this.enemy.type;
        this.alpha = 0;

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);

        this.img = this.scene.add.sprite(0, 0, "texture_atlas_1");
        this.add(this.img);

        this.shield = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "enemy_shield");
        this.shield.visible = false;
        this.add(this.shield);

        this.lifeBar = new LifeBar(this.scene, this.enemy.life);
        this.lifeBar.y = -32;
        this.lifeBar.x -= LifeBar.WIDTH / 2;
        this.add(this.lifeBar);

        this.img.anims.play("enemy_" + this.type + "_run");
    }

    public update(time: number, delta: number): void {

        if (this.enemy.life === 0) {
            return;
        }

        if (this.enemy.teleporting) {
            this.scaleX = .175;
            this.scaleY = .175;
            return;
        }

        if (this.enemy.affectedByGlue || this.enemy.affectedByGlueBullet) {
            if (this.img.anims.currentAnim.key === "enemy_" + this.type + "_run") {
                this.img.anims.play("enemy_" + this.type + "_run_frozen");
            }
        } else {
            if (this.img.anims.currentAnim.key === "enemy_" + this.type + "_run_frozen") {
                this.img.anims.play("enemy_" + this.type + "_run");
            }
        }

        if (this.enemy.hasBeenTeleported) {
            if (!this.shield.visible) {
                this.shield.visible = true;
            }
        } else {
            if (this.shield.visible) {
                this.shield.visible = false;
            }
        }

        this.scaleX = 1;
        this.scaleY = 1;

        let smoothFactor: number;

        if (GameConstants.INTERPOLATE_TRAJECTORIES) {
            smoothFactor = GameVars.timeStepFactor === 1 ? .15 : .5;
        } else {
            smoothFactor = 1;
        }

        this.x += (this.enemy.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        this.y += (this.enemy.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;

        this.lifeBar.updateValue(this.enemy.life);

        // para suavizar la aparición
        if (this.alpha < 1) {
            this.alpha += GameVars.timeStepFactor === 1 ? .035 : .1;
        }
    }

    public hit(): void {
        
        this.lifeBar.visible = true;
    }

    public glueHit(): void {
        // de momento nada
    }

    public teleport(glueTurret: Creepts.GlueTurret): void {
        
        const glueTurret_px = (glueTurret.position.c + .5) * GameConstants.CELLS_SIZE;
        const glueTurret_py = (glueTurret.position.r + .5) * GameConstants.CELLS_SIZE - 8;

        this.scene.tweens.add({
            targets: this,
            x: glueTurret_px,
            y: glueTurret_py,
            scaleX: .175,
            scaleY: .175,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500
        });
    }

    public die(): void {

        this.lifeBar.visible = false;

        // a veces la bala impacta contra un enemigo q ya esta muerto
        // y que ya no se mueve. por esto hacemos q el enemigo
        // al desaparecer continue moviendose
        let f = this.type === Creepts.GameConstants.ENEMY_FLIER || this.type === Creepts.GameConstants.ENEMY_RUNNER ? 3 : 1.5;

        const dx = f * (this.enemy.x - this.enemy.prevX) * GameConstants.CELLS_SIZE;
        const dy = f * (this.enemy.y - this.enemy.prevY) * GameConstants.CELLS_SIZE;

        this.scene.tweens.add({
            targets: this,
            x: this.x + dx,
            y: this.y + dy,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 600
        });

        this.scene.tweens.add({
            targets: this,
            scaleX: 1.25,
            scaleY: 1.25,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.In,
            duration: 600,
            onComplete: function(): void {
                this.destroy();
            },
            onCompleteScope: this
        });
    }
}
