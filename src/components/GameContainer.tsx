import React from "react";
import Phaser from "phaser";

import { Game } from "../Game";
import { GameConstants } from "../GameConstants";
import { BootScene } from "../scenes/BootScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { BattleScene } from "../scenes/battle-scene/BattleScene";
import { MapsScene } from "../scenes/maps-scene/MapsScene";
import { LogScene } from "../scenes/log-scene/LogScene";

export interface IGameContainerProps { visible: boolean }
interface IGameContainerState { height: number }

export default class GameContainer extends React.Component<IGameContainerProps, IGameContainerState> {

    constructor(props: IGameContainerProps) {
        super(props);
        this.state = {
            height: 0
        }
    }

    resize = () => {
        this.setState({ height: window.innerHeight });
    }

    componentDidMount() {
        this.createGame();
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
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
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },

            scene: [
                BootScene,
                PreloadScene,
                LogScene,
                BattleScene,
                MapsScene
            ]
        };

        // If compilation error here, compare Phaser definitions file of working copy (phaser.d.ts, line 48040 on 27-05-2019)
        // Also make sure to delete all *.ts files in node_modules/trailz folder
        new Game(gameConfig);
    }

    public render() {
        const visibility = this.props.visible ? "visible" : "hidden";
        return (
            <div
                id="phaser-game"
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    visibility,
                    width: "100vw",
                    height: `${this.state.height}px`
                }}
            />
        );
    }
}
