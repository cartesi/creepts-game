import { GameConstants } from "../../../GameConstants";
import { BattleManager } from "../BattleManager";
import { BoardContainer } from "../BoardContainer";

export class TurretActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;
    public p: {r: number, c: number};
    public canonLength: number;
    public base: Phaser.GameObjects.Image;
    public canon: Phaser.GameObjects.Image;

    protected anutoTurret: Anuto.Turret;
    
    private rangeCircle: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, type: string, position: {r: number, c: number}) {

        super(scene);

        this.p = position;
        this.name = type;
        
        this.anutoTurret = BattleManager.addTurret(type, this.p);
        this.id = this.anutoTurret.id;

        this.x = GameConstants.CELLS_SIZE * (this.p.c + .5);
        this.y = GameConstants.CELLS_SIZE * (this.p.r + .5);

        // este valor habra q sacarlo de la imagen del cañón
        this.canonLength = 40;

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.rangeCircle = new Phaser.GameObjects.Graphics(this.scene);
            this.rangeCircle.lineStyle(2, 0x00FF00);
            this.rangeCircle.strokeCircle(0, 0, this.anutoTurret.range * GameConstants.CELLS_SIZE);
            this.add(this.rangeCircle);
        }
    }

    public update(time: number, delta: number): void {
        
        if (this.anutoTurret.enemiesWithinRange.length > 0) {
            
            if (this.anutoTurret.followedEnemy) {

                const followedEnemyActor = BoardContainer.currentInstance.getEnemyActorByID(this.anutoTurret.followedEnemy.id);

                if (followedEnemyActor) {
                    const dx = followedEnemyActor.x - this.x;
                    const dy = followedEnemyActor.y - this.y;

                    if (this.canon) {
                        this.canon.rotation = Math.atan2(dy, dx) + Math.PI / 2;
                    }
                }
            }
        }
    }

    public shoot(): void {
        //
    }

    protected onDownTurret(): void {
        //
    }
}
