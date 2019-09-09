import Phaser from "phaser";
import * as React from "react";

import { Game } from "../Game";
import { GameConstants } from "../GameConstants";
import { BootScene } from "../scenes/BootScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { BattleScene } from "../scenes/battle-scene/BattleScene";
import { MapsScene } from "../scenes/maps-scene/MapsScene";
import { GameManager } from "../GameManager";
import { RouteComponentProps } from "react-router";

type TParams = { map: string };
export interface IGameProps extends RouteComponentProps<TParams> { }

export default class IGame extends React.Component<IGameProps, any> {

    private game: Phaser.Game;

    private maps = {
        "original": 0,
        "waiting-line": 1,
        "turn-round": 2,
        "hurry": 3,
        "civyshk_yard": 4,
        "civyshk_2y": 5,
        "civyshk_line5": 6,
        "civyshk_labyrinth": 7,
    }

    constructor(props: IGameProps) {
        super(props);
        this.state = {
            height: GameConstants.GAME_HEIGHT
        }
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
        this.game = new Game(gameConfig);

        // XXX: react-router makes this a little more tedious...
        // const map = this.props.map;
        const map = this.props.match.params.map;

        this.game.scene.add(BootScene.name, BootScene, true, { mapIndex: this.maps[map] || 0 });
        this.game.scene.add(PreloadScene.name, PreloadScene);
        this.game.scene.add(BattleScene.name, BattleScene);
        this.game.scene.add(MapsScene.name, MapsScene);

        this.updateDimensions();
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

    componentDidUpdate(prevProps: IGameProps, prevState: any, snapshot: any) {
        // const map = this.props.map;
        // const prevMap = prevProps.map;
        const map = this.props.match.params.map;
        const prevMap = prevProps.match.params.map;

        if (map !== prevMap) {
            GameManager.mapSelected(this.maps[map]);
        }
    }

    public render() {
        return <div id="phaser-game" style={{ height: `${this.state.height}px` }} />
    }
}
