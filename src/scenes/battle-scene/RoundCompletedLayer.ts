import { BoardContainer } from './BoardContainer';
import { GameManager } from './../../GameManager';
import { BattleManager } from './BattleManager';
import { Button } from "../../utils/Utils";
import { GameConstants } from "../../GameConstants";
import { GameVars } from '../../GameVars';

export class RoundCompletedLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);

        const titleBck = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "title_area");
        this.add(titleBck);

        let score = new Phaser.GameObjects.Text(this.scene, 0, 0, "ROUND  " + BattleManager.anutoEngine.round + "  COMPLETED", {fontFamily: "Rubik-Regular", fontSize: "28px", color: "#FFFFFF"});
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
