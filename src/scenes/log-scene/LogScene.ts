// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { HUD } from "../battle-scene/hud/HUD";
import { GameVars } from "../../GameVars";
import { BattleManager } from "../battle-scene/BattleManager";
import { BoardContainer } from "../battle-scene/BoardContainer";
import { GameConstants } from "../../GameConstants";
import { LogGUI } from "./LogGUI";

export class LogScene extends Phaser.Scene {

    public static currentInstance: LogScene;

    public hud: HUD;
    public gui: LogGUI;
    public boardContainer: BoardContainer;

    constructor() {

        super("LogScene");
        LogScene.currentInstance = this;
    }

    public create(): void {

        GameVars.currentScene = this;

        this.cameras.main.setBackgroundColor(0xCCCCCC);

        BattleManager.init();

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new LogGUI(this);
        this.add.existing(this.gui);
    }

    public update(time: number, delta: number): void {

        while (GameVars.logsObject.actions.length && GameVars.logsObject.actions[0].tick === BattleManager.engine.ticksCounter) {

            var action = GameVars.logsObject.actions.shift();
    
            switch (action.type) {
                case GameConstants.TYPE_NEXT_WAVE:
                    BattleManager.newWave();
                    break;
                case GameConstants.TYPE_ADD_TURRET:
                    BattleManager.addTurretToScene(action.turretType, action.position);
                    break;
                case GameConstants.TYPE_SELL_TURRET:
                    BattleManager.sellTurret(action.id);
                    break;
                case GameConstants.TYPE_UPGRADE_TURRET:
                    BattleManager.upgradeTower(action.id);
                    break;
                case GameConstants.TYPE_LEVEL_UP_TURRET:
                    BattleManager.improveTurret(action.id);
                    break;
                case GameConstants.TYPE_CHANGE_STRATEGY_TURRET:
                    BattleManager.setNextStrategy(action.id);
                    break;
                case GameConstants.TYPE_CHANGE_FIXED_TARGET_TURRET:
                    BattleManager.setFixedTarget(action.id);
                    break;
                default:
                    break;
            }
        }

        BattleManager.update(time, delta);

        this.boardContainer.update(time, delta);
        this.hud.update(time, delta);
    }
}
