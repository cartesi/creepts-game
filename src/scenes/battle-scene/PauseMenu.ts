import { AudioManager } from "./../../AudioManager";
import { GameManager } from "./../../GameManager";
import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { MenuButton } from "./gui/MenuButton";
import { MenuTitle } from "./gui/MenuTitle";

export class PauseMenu extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        const margin = 20;
        const titleGap = 40;
        const gap = 10;

        const buttons: MenuButton[] = [
            // restart
            new MenuButton(this.scene, "RESTART", () => GameManager.reset()),

            // sound on/off
            new MenuButton(this.scene, GameVars.gameData.soundMuted ? "SOUND ON" : "SOUND OFF", (button: MenuButton) => {
                AudioManager.toggleSoundState();
                button.setLabel(GameVars.gameData.soundMuted ? "SOUND ON" : "SOUND OFF");
            }),

            new MenuButton(this.scene, GameVars.gameData.musicMuted ? "MUSIC ON" : "MUSIC OFF", (button: MenuButton) => {
                AudioManager.toggleMusicState();
                button.setLabel(GameVars.gameData.musicMuted ? "MUSIC ON" : "MUSIC OFF");
            }),

            // change map
            //vXXX: hiding change map menu
            // new MenuButton(this.scene, width, height, "CHANGE MAP", () => GameManager.enterMapScene()),

            // exitButton
            new MenuButton(this.scene, "EXIT", () => GameManager.events.emit("exit"))
        ];

        // this is a box for the content, vertically centered
        // XXX: it's not really vertically centered, because we don't calculate the total height at this point
        const box = new Phaser.GameObjects.Container(this.scene);
        box.setPosition(0, -GameConstants.GAME_HEIGHT / 4);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        box.add(background);

        // vertical position, start with top margin
        let y = 0 + margin;

        // title of dialog
        const title = new MenuTitle(this.scene, "PAUSED");
        title.setPosition(0, y + (title.height / 2));
        box.add(title);
        y += title.height + titleGap;

        // add each button
        buttons.forEach((button) => {
            button.setPosition(0, y + (button.height / 2));
            box.add(button);
            y += button.height + gap;
        });
        // remove the extra gap of last button
        y -= gap;

        // add the bottom margin
        y += margin;

        // draw background using final y
        background.fillStyle(0x000000);
        background.fillRect(-200, 0, 400, y);
        background.alpha = .75;

        this.add(box);
    }

}
