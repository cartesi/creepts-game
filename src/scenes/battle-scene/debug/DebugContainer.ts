// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

import * as Creepts from "@cartesi/creepts-engine";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { BattleManager } from "../BattleManager";

export class DebugContainer extends Phaser.GameObjects.Container {

    private checkpointsContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.addPath();

        this.checkpointsContainer = new Phaser.GameObjects.Container(scene);
        this.add(this.checkpointsContainer);
        this.resetCheckpoints();
    }

    private addPath() {
        const path = new Phaser.GameObjects.Graphics(this.scene);
        path.lineStyle(2, 0xFFA500);
        for (let i = 0; i < GameVars.enemiesPathCells.length - 1; i ++) {
            let x = (GameVars.enemiesPathCells[i].c + .5) * GameConstants.CELLS_SIZE;
            let y = (GameVars.enemiesPathCells[i].r + .5) * GameConstants.CELLS_SIZE;
            path.moveTo(x, y);
            x = (GameVars.enemiesPathCells[i + 1].c + .5) * GameConstants.CELLS_SIZE;
            y = (GameVars.enemiesPathCells[i + 1].r + .5) * GameConstants.CELLS_SIZE;
            path.lineTo(x, y);
            path.stroke();
        }
        this.add(path);
    }

    private addCheckpoints() {
        const engine = BattleManager.engine;
        engine.checkpoints.forEach(checkpoint => {
            // green for enter, red for leave
            const color = checkpoint.event == Creepts.GameConstants.CHECKPOINT_EVENT_ENTER ? 0x00ff00 : 0xff0000;
            const shape = new Phaser.GameObjects.Graphics(this.scene);
            shape.lineStyle(1, color, 0.9);
            const x1 = checkpoint.x * GameConstants.CELLS_SIZE;
            const y1 = checkpoint.y * GameConstants.CELLS_SIZE;
            const x2 = checkpoint.turret.x * GameConstants.CELLS_SIZE;
            const y2 = checkpoint.turret.y * GameConstants.CELLS_SIZE;
            shape.lineBetween(x1, y1, x2, y2);
            this.checkpointsContainer.add(shape);
        });
    }

    public resetCheckpoints() {
        // first remove all checkpoint shapes
        this.checkpointsContainer.removeAll(true);
        this.addCheckpoints();
    }
}
