import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, List, BreadcrumbSection, BreadcrumbDivider } from "semantic-ui-react";
import TournamentCard from "./TournamentCard";

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
            <div style={{ padding: "10px"}}>
                <Breadcrumb>
                    <BreadcrumbSection link><Link to="/">Home</Link></BreadcrumbSection>
                    <BreadcrumbDivider />
                    <BreadcrumbSection active>Play</BreadcrumbSection>
                </Breadcrumb>
                <List>
                    {Array.from(tournaments, (tournament, index) => 
                        <TournamentCard key={index} tournament={tournament} />
                    )}
                </List>
            </div>
        );
    }
}