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
                this.setFrame(frameNameOff);
            }, this);

            this.on("pointerup", () => {
                this.setFrame(frameNameOn);
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

