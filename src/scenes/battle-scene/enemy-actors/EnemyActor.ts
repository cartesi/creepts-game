import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { LifeBar } from "./LifeBar";
import * as Anuto from "../../../../engine/src";

export class EnemyActor extends Phaser.GameObjects.Container {

    public type: string;
    public id: number;
   
    protected img: Phaser.GameObjects.Sprite;
    protected lifeBar: LifeBar;
    protected anutoEnemy: Anuto.Enemy;

    constructor(scene: Phaser.Scene, anutoEnemy: Anuto.Enemy, position: {r: number, c: number}) {

        super(scene);

        this.anutoEnemy = anutoEnemy;
        this.id = this.anutoEnemy.id;
        this.type = this.anutoEnemy.type;
        this.alpha = 0;
       
        this.lifeBar = new LifeBar(this.scene, this.anutoEnemy.life);
        this.lifeBar.y = -32;
        this.lifeBar.x -= LifeBar.WIDTH / 2;
        this.add(this.lifeBar);

        this.x = GameConstants.CELLS_SIZE * (position.c + .5);
        this.y = GameConstants.CELLS_SIZE * (position.r + .5);
    }

    public update(time: number, delta: number): void {

        if (this.anutoEnemy.life === 0) {
            return;
        }

        if (this.anutoEnemy.teleporting) {
            this.scaleX = .175;
            this.scaleY = .175;
            return;
        }

        if (this.anutoEnemy.affectedByGlue || this.anutoEnemy.affectedByGlueBullet) {
            if (this.img.tint !== 0xb2e5ff) {
                this.img.setTint(0xb2e5ff);
            }
        } else {
            if (this.anutoEnemy.hasBeenTeleported) {
                if (this.img.tint !== 0xe4c0ff) {
                    this.img.setTint(0xe4c0ff);
                }
            } else {
                if (this.img.tint !== 0xFFFFFF) {
                    this.img.setTint(0xFFFFFF);
                }
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

        this.x += (this.anutoEnemy.x * GameConstants.CELLS_SIZE - this.x) * smoothFactor;
        this.y += (this.anutoEnemy.y * GameConstants.CELLS_SIZE - this.y) * smoothFactor;

        this.lifeBar.updateValue(this.anutoEnemy.life);

        // para suavizar la aparición
        if (this.alpha < 1) {
            this.alpha += GameVars.timeStepFactor === 1 ? .035 : .1;
        }
    }

    public hit(): void {
        // de momento nada
    }

    public glueHit(): void {
        // de momento nada
    }

    public teleport(anutoGlueTurret: Anuto.GlueTurret): void {
        
        const glueTurret_px = (anutoGlueTurret.position.c + .5) * GameConstants.CELLS_SIZE;
        const glueTurret_py = (anutoGlueTurret.position.r + .5) * GameConstants.CELLS_SIZE - 8;

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
        let f = this.type === Anuto.GameConstants.ENEMY_FLIER || this.type === Anuto.GameConstants.ENEMY_RUNNER ? 3 : 1.5;

        const dx = f * (this.anutoEnemy.x - this.anutoEnemy.prevX) * GameConstants.CELLS_SIZE;
        const dy = f * (this.anutoEnemy.y - this.anutoEnemy.prevY) * GameConstants.CELLS_SIZE;

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
