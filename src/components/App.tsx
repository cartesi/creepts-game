import React, { Component } from "react";
import Game from "./Game";

interface IState { map: string }
interface IProps {}

export default class App extends Component<IProps, IState> {
    
    constructor(props: any) {
        super(props);

        this.state = {
            map: "the-original"
        }
    }

    changeMap(event: any) {
        this.setState({ map: event.target.value });
    }

    render() {
        return (
            <div>
                <select id="map" onChange={this.changeMap.bind(this)} value={this.state.map}>
                    <option value="original">The Original</option>
                    <option value="waiting-line">I hate waiting lines</option>
                    <option value="turn-round">Turn a round</option>
                    <option value="hurry">We're in a hurry!</option>
                    <option value="civyshk_yard">Civyshk Yard</option>
                    <option value="civyshk_2y">Civyshk 2Y</option>
                    <option value="civyshk_line5">Civyshk Line5</option>
                    <option value="civyshk_labyrinth">Civyshk Labyrinth</option>
                </select>
                <Game map={this.state.map} />
            </div>
        );
    }
}
