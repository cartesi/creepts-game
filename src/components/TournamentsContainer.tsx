import React from "react";
import { A } from "hookrouter";
import { Breadcrumb, List, Message } from "semantic-ui-react";
import { TournamentCard } from "./TournamentCard";
import { LoadingCard } from "./LoadingCard";
import { TournamentPhase } from "../Tournament";
import { useTournamentsService } from "../services/tournamentService";

interface IState { }
interface IProps { name: string, me?: boolean, phase?: TournamentPhase }

export const TournamentsContainer: React.FC<IProps> = ({ name, phase, me }) => {
    const service = useTournamentsService(phase, me);

    return (
        <div style={{ padding: "10px"}}>
            <Breadcrumb>
                <Breadcrumb.Section as={A} href="/">Home</Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section active>{name}</Breadcrumb.Section>
            </Breadcrumb>

            {service.status === "loading" && <List><LoadingCard /></List> }
            {service.status === "loaded" && 
                <List>
                    {service.payload.results.map((tournament, index) => (
                        <TournamentCard
                            key={index}
                            tournament={tournament}
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
