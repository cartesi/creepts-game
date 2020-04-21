// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


export class ProgressBar extends Phaser.GameObjects.Container {

    private totalWidth: number;
    private progress: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.totalWidth = width;
        const fillColor = 0x0077bd;
        this.progress = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 0, height, fillColor, 1);
        this.progress.setOrigin(0, 0);
        this.add(this.progress);
    }

    public setProgress(progress: number) {
        this.progress.width = this.totalWidth * progress;
    }

}