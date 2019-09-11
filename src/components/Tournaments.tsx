import React, { Component } from "react";
import { Link } from "react-router-dom";

interface IState { }
interface IProps { filter: string }

export default class Tournaments extends Component<IProps, IState> {

    private maps = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth"
    ];

    render() {
        const tournaments = Array.from(this.maps, (map) => ({
            id: map,
            name: map,
            phase: "commit",
            deadline: "2019-09-10T21:54:58Z"
        }));
        return (
            <div>
                <ul>
                    {Array.from(tournaments, (t, index) => 
                        <li key={index}><Link to={`/tournaments/${t.id}`}>{t.name}</Link></li>
                    )}
                </ul>
            </div>
        );
    }
}