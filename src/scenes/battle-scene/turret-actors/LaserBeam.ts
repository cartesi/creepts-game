import { EnemyActor } from "../enemy-actors/EnemyActor";
import { LaserTurretActor } from "./LaserTurretActor";
import { GameVars } from "../../../GameVars";

export class LaserBeam extends Phaser.GameObjects.Graphics {

    private laserTurretActor: LaserTurretActor;
    private enemyActors: EnemyActor[];
    private f: number;
    private framesDuration: number;
    private impact_x: number[];
    private impact_y: number[];
    private grade: number;

    constructor(scene: Phaser.Scene, laserTurretActor: LaserTurretActor, enemyActors: EnemyActor[], grade: number) {

        super(scene);

        this.laserTurretActor = laserTurretActor;
        this.enemyActors = enemyActors;
        this.grade = grade;
        this.f = 0;
        this.framesDuration = GameVars.timeStepFactor === 1 ? 24 : 6;

        this.impact_x = [];
        this.impact_y = [];

        for (let i = 0; i < this.enemyActors.length; i++) {
            this.impact_x.push(this.enemyActors[i].x);
            this.impact_y.push(this.enemyActors[i].y);
        }

        // HAY Q HACER ESTO PQ EL METODO UPDATE NO SE UTILIZA DE MANERA AUTOMATICA
        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        this.clear();

        if (this.f ++ === this.framesDuration) {
            this.destroy();
            return;
        }

        if (this.grade === 3) {

            let impact_x = this.enemyActors[0].x;
            let impact_y = this.enemyActors[0].y;

            const emmission_x = this.laserTurretActor.x + this.laserTurretActor.canonLength * Math.cos(this.laserTurretActor.canon.rotation - Math.PI / 2);
            const emmission_y = this.laserTurretActor.y + this.laserTurretActor.canonLength * Math.sin(this.laserTurretActor.canon.rotation - Math.PI / 2);

            let offX = impact_x - emmission_x;
            let offY = impact_y - emmission_y;

            impact_x += (offX * 50);
            impact_y += (offY * 50);

            // se remata por un circulo
            let r1 = this.f % 2 === 0 ? 15 : 8;
            let r2 = this.f % 2 === 0 ? 8 : 4;
            let alpha1 = this.f % 2 === 0 ? .1 : .2;
            let alpha2 = this.f % 2 === 0 ? .3 : .6;
            let alpha3 =  this.f % 2 === 0 ? .6 : .8;

            this.fillStyle(0xFF0000, alpha1);
            this.fillCircle(impact_x,  impact_y, r1);

            this.fillStyle(0xFF0000, alpha2);
            this.fillCircle( impact_x,  impact_y, r2);

            this.lineStyle(r1, 0xFF0000, alpha1);
            this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
            this.stroke();

            this.lineStyle(r1 * .5, 0xFF0000, alpha2);
            this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
            this.stroke();

            this.lineStyle(r1 * .2, 0xFFC0BF, alpha3);
            this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
            this.stroke();
        } else {
            this.impact_x = [];
            this.impact_y = [];

            for (let i = 0; i < this.enemyActors.length; i++) {
                this.impact_x.push(this.enemyActors[i].x);
                this.impact_y.push(this.enemyActors[i].y);
            }

            for (let i = 0; i < this.enemyActors.length; i++) {

                let impact_x;
                let impact_y;
                
                let emmission_x;
                let emmission_y;

                if (i === 0) {

                    impact_x = this.impact_x[i];
                    impact_y = this.impact_y[i];
                    
                    emmission_x = this.laserTurretActor.x + this.laserTurretActor.canonLength * Math.cos(this.laserTurretActor.canon.rotation - Math.PI / 2);
                    emmission_y = this.laserTurretActor.y + this.laserTurretActor.canonLength * Math.sin(this.laserTurretActor.canon.rotation - Math.PI / 2);
                } else {
                    impact_x = this.impact_x[i];
                    impact_y = this.impact_y[i];
                    
                    emmission_x = this.impact_x[i - 1];
                    emmission_y = this.impact_y[i - 1];
                }

                // se remata por un circulo
                let r1 = this.f % 2 === 0 ? 15 : 8;
                let r2 = this.f % 2 === 0 ? 8 : 4;
                let alpha1 = this.f % 2 === 0 ? .1 : .2;
                let alpha2 = this.f % 2 === 0 ? .3 : .6;
                let alpha3 =  this.f % 2 === 0 ? .6 : .8;

                this.fillStyle(0xFF0000, alpha1);
                this.fillCircle(impact_x,  impact_y, r1);

                this.fillStyle(0xFF0000, alpha2);
                this.fillCircle( impact_x,  impact_y, r2);

                this.lineStyle(r1, 0xFF0000, alpha1);
                this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
                this.stroke();

                this.lineStyle(r1 * .5, 0xFF0000, alpha2);
                this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
                this.stroke();

                this.lineStyle(r1 * .2, 0xFFC0BF, alpha3);
                this.lineBetween(emmission_x, emmission_y, impact_x,  impact_y);
                this.stroke();
            }
        }
    }
}
