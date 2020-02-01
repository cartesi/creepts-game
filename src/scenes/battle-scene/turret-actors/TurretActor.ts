// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { TurretLevel } from './TurretLevel';
import { BattleScene } from './../BattleScene';
import { BoardContainer } from "./../BoardContainer";
import { GameConstants } from "../../../GameConstants";
import { BattleManager } from "../BattleManager";
import { GameVars } from "../../../GameVars";
import * as Creepts from "../../../../engine/src";

export class TurretActor extends Phaser.GameObjects.Container {

    public id: number;
    public level: number;
    public p: {r: number, c: number};
    public canonLength: number;
    public base: Phaser.GameObjects.Image;
    public canon: Phaser.GameObjects.Image;
    public turretLevel: TurretLevel;
    public turret: Creepts.Turret;
    public showLevel: boolean;
    
    
    private rangeCircle: Phaser.GameObjects.Image;
    private followedEnemy: any;

    constructor(scene: Phaser.Scene, type: string, position: {r: number, c: number}, turret: Creepts.Turret) {

        super(scene);

        this.p = position;
        this.name = type;
        this.showLevel = false;

        this.setScale(.82);
        
        this.turret = turret;
        this.id = this.turret.id;

        this.x = GameConstants.CELLS_SIZE * (this.p.c + .5);
        this.y = GameConstants.CELLS_SIZE * (this.p.r + .5);

        this.canonLength = 40;

        let typeRange = "";

        switch (type) {

            case Creepts.GameConstants.TURRET_LAUNCH:
                typeRange = "yellow";
                break;
            case Creepts.GameConstants.TURRET_PROJECTILE:
                    typeRange = "green";
                break;
            case Creepts.GameConstants.TURRET_LASER:
                    typeRange = "pink";
                break;
            case Creepts.GameConstants.TURRET_GLUE:
                    typeRange = "blue";
                break;
            default:
                break;
        }

        this.rangeCircle = BattleManager.createRangeCircle(this.turret.range * GameConstants.CELLS_SIZE, this.x, this.y, typeRange);

        this.turretLevel = new TurretLevel(this.scene, this);
        this.add(this.turretLevel);

        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        this.turretLevel.update();
    }

    public update(time: number, delta: number): void {
        
        let enemiesWithinRange = this.turret.getEnemiesWithinRange();

        if (this.turret.fixedTarget) {
            if (enemiesWithinRange.length > 0) {
                if (enemiesWithinRange.indexOf(this.followedEnemy) === -1) {
                    this.followedEnemy = enemiesWithinRange[0];
                }
            }
        } else if (enemiesWithinRange.length > 0) {
            this.followedEnemy = enemiesWithinRange[0];
        }

        if (this.followedEnemy) {
            const followedEnemyActor = BoardContainer.currentInstance.getEnemyActorByID(this.followedEnemy.id);

            if (followedEnemyActor) {
                const dx = followedEnemyActor.x - this.x;
                const dy = followedEnemyActor.y - this.y;

                if (this.canon) {
                    this.canon.rotation = Math.atan2(dy, dx) + Math.PI / 2;
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
        this.rangeCircle.setScale((this.turret.range * GameConstants.CELLS_SIZE * 2) / this.rangeCircle.width);
    }

    protected shoot(): void {
        //
    }

    protected onDownTurret(): void {

        if (GameVars.currentScene !== BattleScene.currentInstance) {
            return;
        }

        if (GameVars.paused || BattleManager.engine.gameOver) {
            return;
        }

        if (!this.rangeCircle.visible) {
            BattleManager.hideTurretMenu();
            BattleManager.hideRangeCircles();
            this.rangeCircle.visible = true;
        } else {
            BattleManager.showTurretMenu(this.turret);
        }
    }

    protected onOverTurret(): void {

        this.showLevel = true;
    }

    protected onOutTurret(): void {

        this.showLevel = false;
    }
}
