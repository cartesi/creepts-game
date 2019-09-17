import React, { Component } from "react";
import { GameManager } from "../GameManager";
import { navigate } from "hookrouter";

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
    ];

    componentDidMount() {
        const map = this.props.id;

        // select the map of the tournament
        GameManager.mapSelected(this.maps.indexOf(map));

        // exit button return no home
        GameManager.events.on("exit", () => {
            navigate('/');
        });
    }

    render() {
        return (
            <div></div>
        );
    }
}
