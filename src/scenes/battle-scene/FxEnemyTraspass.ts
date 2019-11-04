import { GameVars } from './../../GameVars';
import { GameConstants } from "../../GameConstants";
import { BattleManager } from './BattleManager';

export class FxEnemyTraspass extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        
        super(scene);

        let left = new Phaser.GameObjects.Image(this.scene, 0, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        left.setOrigin(1, 0);
        left.setScale((GameConstants.GAME_HEIGHT - 122 * GameVars.scaleY) / left.width, 1);
        left.setAngle(-90);
        this.add(left);

        let right = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        right.setOrigin(1, 0);
        right.setScale((GameConstants.GAME_HEIGHT - 122 * GameVars.scaleY) / left.width, -1);
        right.setAngle(-90);
        this.add(right);

        let top = new Phaser.GameObjects.Image(this.scene, 0, 122 * GameVars.scaleY, "texture_atlas_1", "fx_enemy_traspass");
        top.setOrigin(0);
        top.setScale(GameConstants.GAME_WIDTH / left.width, 1);
        this.add(top);

        let bottom = new Phaser.GameObjects.Image(this.scene, 0, GameConstants.GAME_HEIGHT, "texture_atlas_1", "fx_enemy_traspass");
        bottom.setOrigin(0);
        bottom.setScale(GameConstants.GAME_WIDTH / left.width, -1);
        this.add(bottom);

        let duration = GameVars.timeStepFactor === 1 ? 800 : 200;

        if (BattleManager.anutoEngine.noEnemiesOnStage) {
            duration *= 2;
        }

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.In,
            duration: duration,
            onComplete: function(): void {
                this.destroy();
            },
            onCompleteScope: this
        });
    }
}
