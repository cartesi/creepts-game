// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import Phaser from "phaser";

export class MenuTitle extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 360;

    public static readonly HEIGHT = 70;

    constructor(scene: Phaser.Scene, label: string) {
        super(scene);
        this.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);

        const titleBck = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "title_area");
        this.add(titleBck);

        // text
        const title = new Phaser.GameObjects.Text(this.scene, 0, 0, label, { fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF" });
        title.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);
        title.setAlign("center");
        title.setOrigin(0.5, 0.5);
        this.add(title);
   }

}
