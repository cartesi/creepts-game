import React, { Component } from "react";
import { GameManager } from "../GameManager";

interface IProps { id: string }
interface IState { }

export default class Tournament extends Component<IProps, IState> {

    private maps = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ]

    componentDidMount() {
        const map = this.props.id;
        GameManager.mapSelected(this.maps.indexOf(map));
    }

    render() {
        return (
            <div></div>
        );
    }
}
