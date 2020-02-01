// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


export class LifeBar extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 43;

    private bar: Phaser.GameObjects.Image;
    private totalLife: number;

    constructor(scene: Phaser.Scene, totalLife: number) {

        super(scene);

        this.totalLife = totalLife;

        this.bar = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "life_bar_1");
        this.bar.setOrigin(0);
        this.add(this.bar);

        this.visible = false;
    }

    public updateValue(life: number): void {

        let num = Math.round((life / this.totalLife) * 40);
        this.bar.setFrame("life_bar_" + Math.max(num, 1));
        
        // this.bar.scaleX = life / this.totalLife;
    }
}
