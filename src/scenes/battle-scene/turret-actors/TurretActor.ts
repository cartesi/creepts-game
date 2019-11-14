import { TurretLevel } from './TurretLevel';
import { BattleScene } from './../BattleScene';
import { BoardContainer } from "./../BoardContainer";
import { GameConstants } from "../../../GameConstants";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import * as Anuto from "../../../../engine/src";

export class TurretActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;
    public p: {r: number, c: number};
    public canonLength: number;
    public base: Phaser.GameObjects.Image;
    public canon: Phaser.GameObjects.Image;
    public turretLevel: TurretLevel;
    public anutoTurret: Anuto.Turret;
    public showLevel: boolean;
    
    private rangeCircle: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, type: string, position: {r: number, c: number}, turret: Anuto.Turret) {

        super(scene);

        this.p = position;
        this.name = type;
        this.showLevel = false;

        this.setScale(.82);
        
        this.anutoTurret = turret;
        this.id = this.anutoTurret.id;

        this.x = GameConstants.CELLS_SIZE * (this.p.c + .5);
        this.y = GameConstants.CELLS_SIZE * (this.p.r + .5);

        this.canonLength = 40;

        let typeRange = "";

        switch (type) {

            case Anuto.GameConstants.TURRET_LAUNCH:
                typeRange = "yellow";
                break;
            case Anuto.GameConstants.TURRET_PROJECTILE:
                    typeRange = "green";
                break;
            case Anuto.GameConstants.TURRET_LASER:
                    typeRange = "pink";
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                    typeRange = "blue";
                break;
            default:
                break;
        }

        this.rangeCircle = BattleManager.createRangeCircle(this.anutoTurret.range * GameConstants.CELLS_SIZE, this.x, this.y, typeRange);

        this.turretLevel = new TurretLevel(this.scene, this);
        this.add(this.turretLevel);

        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        this.turretLevel.update();
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

    public upgrade(): void {
        
        this.reloadRangeCircle();
    }

    public improve(): void {
        
        this.reloadRangeCircle();
    }

    public reloadRangeCircle(): void {

        this.rangeCircle.setScale(1);
        this.rangeCircle.setScale((this.anutoTurret.range * GameConstants.CELLS_SIZE * 2) / this.rangeCircle.width);
    }

    protected shoot(): void {
        //
    }

    protected onDownTurret(): void {

        if (GameVars.currentScene !== BattleScene.currentInstance) {
            return;
        }

        if (GameVars.paused || BattleManager.anutoEngine.gameOver) {
            return;
        }

        if (!this.rangeCircle.visible) {
            BattleManager.hideRangeCircles();
            this.rangeCircle.visible = true;
        } else {
            BattleManager.showTurretMenu(this.anutoTurret);
        }
    }

    protected onOverTurret(): void {

        this.showLevel = true;
    }

    protected onOutTurret(): void {

        this.showLevel = false;
    }
}
