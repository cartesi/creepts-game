import React, { Component } from "react";
import { Link } from "react-router-dom";

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        const maps: Map<string, string> = new Map<string, string>()
            .set("original", "The Original")
            .set("waiting-line", "I hate waiting lines")
            .set("turn-round", "Turn a round")
            .set("hurry", "We're in a hurry!")
            .set("civyshk_yard", "Civyshk Yard")
            .set("civyshk_2y", "Civyshk 2Y")
            .set("civyshk_line5", "Civyshk Line5")
            .set("civyshk_labyrinth", "Civyshk Labyrinth");

        return (
            <div>
                <ul>
                    {Array.from(maps.entries(), ([slug, name], index) => 
                        <li key={index}><Link to={`/games/${slug}`}>{name}</Link></li>
                    )}
                </ul>
            </div>
        );
    }
}