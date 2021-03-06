// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


export class Button extends Phaser.GameObjects.Image {

    private defaultScale: { x: number, y: number };

    constructor(scene: Phaser.Scene, x: number, y: number, textureAtlas: string, frameNameOff: string, frameNameOn: string = frameNameOff, pixelPerfect?: boolean) {

        super(scene, x, y, textureAtlas, frameNameOff);

        if (pixelPerfect) {
            this.setInteractive(this.scene.input.makePixelPerfect(20));
            this.setInteractive({ pixelPerfect: true });
        } else {
            this.setInteractive();
        }

        if (frameNameOff !== frameNameOn) {
            this.on("pointerover", () => {
                this.setFrame(frameNameOn);
            }, this);

            this.on("pointerout", () => {
                this.setFrame(frameNameOff);
            }, this);

            this.on("pointerdown", () => {
                this.setFrame(frameNameOn);
            }, this);

            this.on("pointerup", () => {
                this.setFrame(frameNameOff);
            }, this);
        }
    }

    public setInflationTween(ratio: number, defaultScaleX: number = this.scaleX, defaultScaleY: number = this.scaleY, tween?: boolean, tweenData?: { ease: any, duration: number }): void {

        this.setScale(defaultScaleX, defaultScaleY);
        this.defaultScale = { x: defaultScaleX, y: defaultScaleY };

        if (tween) {
            if (!tweenData) {
                tweenData = { ease: Phaser.Math.Easing.Cubic.Out, duration: 200 };
            }
        }

        this.on("pointerover", () => {
            if (tween) {
                this.scene.tweens.add({
                    targets: [this],
                    scaleX: this.defaultScale.x * ratio,
                    scaleY: this.defaultScale.y * ratio,
                    ease: tweenData.ease,
                    duration: tweenData.duration,

                });
            } else {
                this.setScale(this.defaultScale.x * ratio, this.defaultScale.y * ratio);
            }
        }, this);

        this.on("pointerout", () => {
            if (tween) {
                this.scene.tweens.add({
                    targets: [this],
                    scaleX: this.defaultScale.x,
                    scaleY: this.defaultScale.y,
                    ease: tweenData.ease,
                    duration: tweenData.duration,

                });
            } else {
                this.setScale(this.defaultScale.x, this.defaultScale.y);
            }
        }, this);

        this.on("pointerdown", () => {
            if (this.scene.game.device.os.desktop) {
                this.setScale(this.defaultScale.x, this.defaultScale.y);
            } else {
                this.setScale(this.defaultScale.x * ratio, this.defaultScale.y * ratio);
            }
        }, this);

        this.on("pointerup", () => {
            if (this.scene.game.device.os.desktop) {
                this.setScale(this.defaultScale.x * ratio, this.defaultScale.y * ratio);
            } else {
                this.setScale(this.defaultScale.x, this.defaultScale.y);
            }
        }, this);
    }

    public onUp(f: Function, context: any): void {
        this.on("pointerup", f, context);
    }

    public onDown(f: Function, context: any): void {
        this.on("pointerdown", f, context);
    }

    public onOver(f: Function, context: any): void {
        this.on("pointerover", f, context);
    }

    public onOut(f: Function, context: any): void {
        this.on("pointerout", f, context);
    }
}

