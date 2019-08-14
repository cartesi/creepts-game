import { BoardContainer } from './BoardContainer';
import { GameManager } from './../../GameManager';
import { BattleManager } from './BattleManager';
import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";
import { GameVars } from '../../GameVars';

export class RoundCompletedLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);

        const bck = new Phaser.GameObjects.Graphics(this.scene);
        bck.fillStyle(0x000000);
        bck.fillRect(-GameConstants.GAME_WIDTH / 2, -100, GameConstants.GAME_WIDTH, 200);
        bck.alpha = .75;
        this.add(bck);

        let score = new Phaser.GameObjects.Text(this.scene, 0, 0, "ROUND " + BattleManager.anutoEngine.round + " COMPLETED", {fontFamily: "Rubik-Regular", fontSize: "55px", color: "#FFFFFF"});
        score.setOrigin(.5);
        this.add(score);

        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500
        });

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            delay: 2000,
            onComplete: () => {
                BoardContainer.currentInstance.hideRoundCompletedLayer();
            },
            onCOmpleteScope: this
        });
    }
}
