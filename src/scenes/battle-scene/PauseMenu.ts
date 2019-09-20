import { AudioManager } from "./../../AudioManager";
import { GameManager } from "./../../GameManager";
import { GameVars } from "../../GameVars";
import { MenuButton } from "./gui/MenuButton";

export class PauseMenu extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        const width = 350;
        const height = 40;
        const padding = 25;

        this.y = -150 * GameVars.scaleY;

        const buttons: MenuButton[] = [
            // restart
            new MenuButton(this.scene, width, height, "RESTART", () => {
                GameManager.reset();
            }),

            // sound on/off
            new MenuButton(this.scene, width, height, GameVars.gameData.muted ? "SOUND ON" : "SOUND OFF", (button: MenuButton) => {
                AudioManager.toggleAudioState();
                button.setLabel(GameVars.gameData.muted ? "SOUND ON" : "SOUND OFF");
            }),

            /* XXX: hiding change map menu
            // change map
            new MenuButton(this.scene, width, height, "CHANGE MAP", () => {
                GameManager.enterMapScene();
            }),
            */

            // exitButton
            new MenuButton(this.scene, width, height, "EXIT", () => {
                GameManager.events.emit("exit");
            })
        ];

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x000000);
        const bH = ((buttons.length + 3) * padding) + (buttons.length * height) + 70;
        background.fillRect(-200, -200, 400, bH);
        background.alpha = .75;
        this.add(background);

        const titleLines = new Phaser.GameObjects.Graphics(this.scene);
        titleLines.setPosition(0, 150);
        titleLines.lineStyle(4, 0xffffff);
        titleLines.strokeRect(-180, -330, 360, 70);
        titleLines.lineStyle(2, 0xffffff);
        titleLines.strokeRect(-170, -320, 340, 50);
        this.add(titleLines);

        let title = new Phaser.GameObjects.Text(this.scene, 0, -165, "PAUSED", {fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF"});
        title.setOrigin(.5, 0);
        this.add(title);

        let offY = -35;

        buttons.forEach((button) => {
            button.setPosition(0, offY);
            this.add(button);
            offY += (height + padding);
        });
    }

}
