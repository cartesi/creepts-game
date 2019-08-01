import { EnemyActor } from "../enemy-actors/EnemyActor";
import { LaserTurretActor } from "./LaserTurretActor";
import { GameVars } from "../../../GameVars";

export class LaserBeam extends Phaser.GameObjects.Graphics {

    private laserTurretActor: LaserTurretActor;
    private enemyActor: EnemyActor;
    private f: number;
    private framesDuration: number;

    constructor(scene: Phaser.Scene, laserTurretActor: LaserTurretActor, enemyActor: EnemyActor) {

        super(scene);

        this.laserTurretActor = laserTurretActor;
        this.enemyActor = enemyActor;

        this.f = 0;
        this.framesDuration = GameVars.timeStepFactor === 1 ? 24 : 6;

        // HAY Q HACER ESTO PQ EL METODO UPDATE NO SE UTILIZA DE MANERA AUTOMATICA
        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {
        
        if (this.f ++ === this.framesDuration) {
            this.destroy();
        }
        
        const emmission_x = this.laserTurretActor.x + this.laserTurretActor.canonLength * Math.cos(this.laserTurretActor.canon.rotation);
        const emmission_y = this.laserTurretActor.y + this.laserTurretActor.canonLength * Math.sin(this.laserTurretActor.canon.rotation);

        this.clear();

        // se remata por un circulo
        let r1 = this.f % 2 === 0 ? 15 : 8;
        let r2 = this.f % 2 === 0 ? 8 : 4;
        let alpha1 = this.f % 2 === 0 ? .1 : .2;
        let alpha2 = this.f % 2 === 0 ? .3 : .6;
        let alpha3 =  this.f % 2 === 0 ? .6 : .8;

        this.fillStyle(0xFF0000, alpha1);
        this.fillCircle( this.enemyActor.x, this.enemyActor.y, r1);

        this.fillStyle(0xFF0000, alpha2);
        this.fillCircle( this.enemyActor.x, this.enemyActor.y, r2);

        this.lineStyle(r1, 0xFF0000, alpha1);
        this.lineBetween(emmission_x, emmission_y, this.enemyActor.x, this.enemyActor.y);
        this.stroke();

        this.lineStyle(r1 * .5, 0xFF0000, alpha2);
        this.lineBetween(emmission_x, emmission_y, this.enemyActor.x, this.enemyActor.y);
        this.stroke();

        this.lineStyle(r1 * .2, 0xFFC0BF, alpha3);
        this.lineBetween(emmission_x, emmission_y, this.enemyActor.x, this.enemyActor.y);
        this.stroke();
    }
}
