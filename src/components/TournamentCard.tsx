import React from "react";
import moment from "moment";
import { A } from "hookrouter";
import { Button, Card } from "semantic-ui-react";
import { MapThumbnail } from "./MapThumbnail";
import { Tournament, TournamentScore } from "../Tournament";

export interface TournamentCardProps {
    tournament: Tournament,
    score?: TournamentScore
}

export const TournamentCard: React.SFC<TournamentCardProps> = ({ tournament, score }) => {
    return (
        <Card key={tournament.id} raised fluid>
            <Card.Content>
                <MapThumbnail map={tournament.map} width={50} height={60} />
                <Card.Header>{tournament.name}</Card.Header>
                <Card.Meta>{tournament.playerCount} {tournament.playerCount > 1 ? "players" : "player"}</Card.Meta>
                {score && <Card.Description>My Highscore: {score.score}</Card.Description>}
                {score && <Card.Description>Wave: [TODO]</Card.Description>}
                <Card.Description>Time Left: {moment(tournament.deadline).fromNow(true)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                {score && <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Improve!</Button>}
                {score || <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Join</Button>}
            </Card.Content>
        </Card>
    );
}
