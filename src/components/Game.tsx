import Phaser from "phaser";
import * as React from "react";

import { Game as PhaserGame } from "../Game";
import { GameConstants } from "../GameConstants";
import { BootScene } from "../scenes/BootScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { BattleScene } from "../scenes/battle-scene/BattleScene";
import { MapsScene } from "../scenes/maps-scene/MapsScene";

export interface IGameProps { visible: boolean }

export default class Game extends React.Component<IGameProps, any> {

    private game: Phaser.Game;

    constructor(props: IGameProps) {
        super(props);
        this.state = {
            height: GameConstants.GAME_HEIGHT
        }
    }

    componentDidMount() {
        this.createGame();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        // use whole window height as game height
        // width is auto adjusted to keep aspect ratio
        this.setState({ height: window.innerHeight });
    }

    createGame() {
        const gameConfig = {

            version: GameConstants.VERSION,
            type: Phaser.AUTO,
            backgroundColor: "#000000",
            parent: "phaser-game",
            width: GameConstants.GAME_WIDTH,
            height: GameConstants.GAME_HEIGHT,
            scale: {
                mode: Phaser.Scale.FIT
            },

            scene: null
        };

        // If compilation error here, compare Phaser definitions file of working copy (phaser.d.ts, line 48040 on 27-05-2019)
        // Also make sure to delete all *.ts files in node_modules/trailz folder
        this.game = new PhaserGame(gameConfig);

        this.game.scene.add(BootScene.name, BootScene, true, { mapIndex: 0 });
        this.game.scene.add(PreloadScene.name, PreloadScene);
        this.game.scene.add(BattleScene.name, BattleScene);
        this.game.scene.add(MapsScene.name, MapsScene);

        this.updateDimensions();
    }

    public render() {
        const visibility = this.props.visible ? "visible" : "hidden";
        return <div id="phaser-game" style={{ height: `${this.state.height}px`, visibility }} />;
    }
}
