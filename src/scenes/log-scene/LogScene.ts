// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

import * as Creepts from "@cartesi/creepts-engine";
import { HUD } from "../battle-scene/hud/HUD";
import { GameVars } from "../../GameVars";
import { BattleManager } from "../battle-scene/BattleManager";
import { BoardContainer } from "../battle-scene/BoardContainer";
import { LogGUI } from "./LogGUI";

export class LogScene extends Phaser.Scene {

    public static currentInstance: LogScene;

    public hud: HUD;
    public gui: LogGUI;
    public boardContainer: BoardContainer;
    private i: number;

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
        this.i = 0;
    }

    public update(time: number, delta: number): void {

        const engine = BattleManager.engine;
        const log = GameVars.logsObject;

        let action = null;
        if (this.i < log.actions.length) {
            action = log.actions[this.i];
        }

        if (action && engine.ticksCounter == action.tick && !GameVars.paused) {
            // we have an action, and it's time to apply it
            this.gui.setProgress(this.i / log.actions.length);
            // console.log(this.i, log.actions.length, action, engine.ticksCounter);
            switch (action.type) {
                case Creepts.GameConstants.ACTION_TYPE_NEXT_WAVE:
                    BattleManager.newWave();
                    break;
                case Creepts.GameConstants.ACTION_TYPE_ADD_TURRET:
                    BattleManager.addTurretToScene(action.turretType, action.position);
                    break;
                case Creepts.GameConstants.ACTION_TYPE_SELL_TURRET:
                    BattleManager.sellTurret(action.id);
                    break;
                case Creepts.GameConstants.ACTION_TYPE_UPGRADE_TURRET:
                    BattleManager.upgradeTower(action.id);
                    break;
                case Creepts.GameConstants.ACTION_TYPE_LEVEL_UP_TURRET:
                    BattleManager.improveTurret(action.id);
                    break;
                case Creepts.GameConstants.ACTION_TYPE_CHANGE_STRATEGY_TURRET:
                    BattleManager.setNextStrategy(action.id);
                    break;
                case Creepts.GameConstants.ACTION_TYPE_CHANGE_FIXED_TARGET_TURRET:
                    BattleManager.setFixedTarget(action.id);
                    break;
                default:
                    break;
            }
            this.i++;
        } else {
            // update game, if it's not over
            if (!engine.gameOver && !GameVars.paused) {
                BattleManager.update(time, delta);
            }            
        }

        this.boardContainer.update(time, delta);
        this.hud.update(time, delta);
    }
}
