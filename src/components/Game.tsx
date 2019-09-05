import Phaser from "phaser";
import * as React from "react";

import { Game } from "../Game";
import { GameManager } from "../GameManager";
import { GameConstants } from "../GameConstants";
import { BootScene } from "../scenes/BootScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { BattleScene } from "../scenes/battle-scene/BattleScene";
import { MapsScene } from "../scenes/maps-scene/MapsScene";

export interface IGameProps {}

export default class IGame extends React.Component<IGameProps, any> {

    constructor(props: IGameProps) {
        super(props);
        this.state = {
            height: GameConstants.GAME_HEIGHT
        }
    }

    componentDidMount() {
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
    
            scene:  [
                        BootScene, 
                        PreloadScene, 
                        BattleScene,
                        MapsScene
                    ]
        };
        
        // If compilation error here, compare Phaser definitions file of working copy (phaser.d.ts, line 48040 on 27-05-2019)
        // Also make sure to delete all *.ts files in node_modules/trailz folder
        let game = new Game(gameConfig);
        
        // XXX: trying to initialize game with different map
        // XXX: do not work
        // GameManager.mapSelected(2);

        this.updateDimensions();
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

    shouldComponentUpdate() {
        return true;
    }

    public render() {
        return <div id="phaser-game" style={{height: `${this.state.height}px`}} />
    }
}
