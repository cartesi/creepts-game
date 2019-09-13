import React, { Component } from "react";
import { Container, Card, List } from "semantic-ui-react";
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
            <Container>
                <List>
                    {Array.from(tournaments, (tournament, index) => 
                        <TournamentCard key={index} tournament={tournament} />
                    )}
                </List>
            </Container>
        );
    }
}