import React from "react";
import { A } from "hookrouter";
import { Breadcrumb, List, Message } from "semantic-ui-react";
import { TournamentCard } from "./TournamentCard";
import { LoadingCard } from "./LoadingCard";
import { TournamentPhase } from "../Tournament";
import useTournamentsService from "../services/useTournamentsService";

interface IState { }
interface IProps { me?: boolean, phase?: TournamentPhase }

export const TournamentsContainer: React.FC<IProps> = ({ phase, me }) => {
    const service = useTournamentsService(phase, me);

    return (
        <div style={{ padding: "10px"}}>
            <Breadcrumb>
                <Breadcrumb.Section as={A} href="/">Home</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section active>Play</Breadcrumb.Section>
            </Breadcrumb>

            {service.status === "loading" && <List><LoadingCard /></List> }
            {service.status === "loaded" && 
                <List>
                    {service.payload.results.map((tournament, index) => (
                        <TournamentCard
                            key={index}
                            tournament={tournament}
                            opponentScore={{score: Math.round(Math.random() * 10e5), waves: (Math.round(Math.random() * 60))}}
                            winningScore={{score: Math.round(Math.random() * 10e5), waves: (Math.round(Math.random() * 60))}}
                            score={{score: Math.round(Math.random() * 10e5), waves: (Math.round(Math.random() * 60))}}
                        />
                    ))}
                </List>
            }
            {service.status === "error" && (
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{service.error}</p>
                </Message>
            )}
        </div>
    );
};
