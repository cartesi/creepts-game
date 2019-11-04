import { EnemyActor } from "../enemy-actors/EnemyActor";
import { LaserTurretActor } from "./LaserTurretActor";
import { GameVars } from "../../../GameVars";

export class LaserBeam extends Phaser.GameObjects.Container {

    private laserTurretActor: LaserTurretActor;
    private enemyActors: EnemyActor[];
    private f: number;
    private framesDuration: number;
    private impact_x: number[];
    private impact_y: number[];
    private grade: number;

    private images: Phaser.GameObjects.Image[];

    constructor(scene: Phaser.Scene, laserTurretActor: LaserTurretActor, enemyActors: EnemyActor[], grade: number) {

        super(scene);

        this.laserTurretActor = laserTurretActor;
        this.enemyActors = enemyActors;
        this.grade = grade;
        this.f = 0;
        this.framesDuration = GameVars.timeStepFactor === 1 ? 16 : 4;

        this.images = [];

        this.impact_x = [];
        this.impact_y = [];

        for (let i = 0; i < this.enemyActors.length; i++) {
            this.impact_x.push(this.enemyActors[i].x);
            this.impact_y.push(this.enemyActors[i].y);
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

            let line = new Phaser.GameObjects.Image(this.scene, impact_x, impact_y, "texture_atlas_1", "bullet_2_mid");
            line.scaleX = Math.hypot(impact_y - emmission_y, impact_x - emmission_x) / line.width;
            line.setOrigin(1, .5);
            line.setAngle(Math.atan2(impact_y - emmission_y, impact_x - emmission_x) * 180 / Math.PI);
            this.add(line);

            let circle = new Phaser.GameObjects.Image(this.scene, emmission_x, emmission_y, "texture_atlas_1", "bullet_2_light");
            this.add(circle);

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

                let line = new Phaser.GameObjects.Image(this.scene, impact_x, impact_y, "texture_atlas_1", "bullet_2_mid");
                line.scaleX = Math.hypot(impact_y - emmission_y, impact_x - emmission_x) / line.width;
                line.scaleY = .4 + this.grade * .2;
                line.setOrigin(1, .5);
                line.setAngle(Math.atan2(impact_y - emmission_y, impact_x - emmission_x) * 180 / Math.PI);
                this.add(line);

                let end = new Phaser.GameObjects.Image(this.scene, impact_x, impact_y, "texture_atlas_1", "bullet_2_tip");
                end.scaleY = .4 + this.grade * .2;
                end.setOrigin(0, .5);
                end.setAngle(Math.atan2(impact_y - emmission_y, impact_x - emmission_x) * 180 / Math.PI);
                this.add(end);

                let circle = new Phaser.GameObjects.Image(this.scene, emmission_x, emmission_y, "texture_atlas_1", "bullet_2_light");
                this.add(circle);
            }
        }
        
        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        if (this.f ++ === this.framesDuration) {
            this.destroy();
            return;
        }
    }
}
