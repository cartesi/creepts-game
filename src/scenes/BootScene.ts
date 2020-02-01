// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { GameManager } from "../GameManager"; 

export class BootScene extends Phaser.Scene {

    public static currentInstance: BootScene;
    
    constructor() {

        super("BootScene");
    }

    public create(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Light", fontSize: 28, color: "#A6F834" });
        this.add.text(-100, -100, "abcdefg", { fontFamily: "Rubik-Regular", fontSize: 28, color: "#A6F834" });

        BootScene.currentInstance = this;
        GameManager.setCurrentScene(this);

        this.scene.setVisible(false);

        GameManager.init();
    }
}
