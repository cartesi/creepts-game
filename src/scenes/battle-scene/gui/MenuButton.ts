// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import Phaser from "phaser";

export class MenuButton extends Phaser.GameObjects.Container {

    public static readonly HEIGHT = 58;
    public static readonly WIDTH = 360;

    private text: Phaser.GameObjects.Text;

    private enabled: boolean;

    constructor(scene: Phaser.Scene, label: string, onClick: (button: MenuButton) => void) {
        super(scene);
        this.enabled = true;
        this.setSize(MenuButton.WIDTH, MenuButton.HEIGHT);

        // behaviour
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, MenuButton.WIDTH, MenuButton.HEIGHT), Phaser.Geom.Rectangle.Contains);
        this.on("pointerover", () => { 
            if (this.enabled && this.alpha === 1) {
                this.setScale(1.025);
            }    
        });
        this.on("pointerout", () => { 
            if (this.enabled && this.alpha === 1) {
                this.setScale(1);
            }    
         });
        this.on("pointerdown", () => {
            if (this.enabled) {
                onClick(this);
            }    
        });

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "btn_rectangle");
        this.add(background);

        // text
        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, label, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#00B4FF"});
        this.text.setOrigin(.5);
        this.add(this.text);
    }

    public setLabel(label: string) {
        this.text.setText(label);
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
   }
}
