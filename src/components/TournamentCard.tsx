import React from "react";
import moment from "moment";
import { A } from "hookrouter";
import { Button, Card, Label, Table } from "semantic-ui-react";
import { MapThumbnail } from "./MapThumbnail";
import { Tournament, TournamentScore, TournamentPhase } from "../Tournament";

export interface TournamentCardProps {
    tournament: Tournament,
    score?: TournamentScore
}

const TournamentPhaseComponent: React.SFC<{ phase: TournamentPhase }> = ({ phase }) => {
    return (
        <Label.Group size="mini">
            <Label horizontal active={phase === TournamentPhase.commit} pointing="right">Commit</Label>
            <Label horizontal active={phase === TournamentPhase.reveal} pointing="right">Reveal</Label>
            <Label horizontal active={phase === TournamentPhase.round} pointing="right">Round</Label>
            <Label horizontal active={phase === TournamentPhase.end}>End</Label>
        </Label.Group>
    );
};

const TournamentDeadline: React.SFC<{ phase: TournamentPhase, deadline: Date }> = ({ phase, deadline }) => {
    switch(phase) {
        case TournamentPhase.commit:
            return <p>{moment(deadline).fromNow(true)} until reveal phase</p>
        case TournamentPhase.reveal:
            return <p>{moment(deadline).fromNow(true)} until round phase</p>
        case TournamentPhase.round:
            return <p>{moment(deadline).fromNow(true)} until next round</p>
        default:
            return null;
    }
}

export const TournamentCard: React.SFC<TournamentCardProps> = ({ tournament, score }) => {
    return (
        <Card key={tournament.id} raised fluid>
            <Card.Content>
                <Card.Meta className="right floated"><MapThumbnail map={tournament.map} width={60} height={72} /></Card.Meta>
                <Card.Header>{tournament.name}</Card.Header>
                <Card.Meta>{tournament.playerCount} {tournament.playerCount > 1 ? "players" : "player"}</Card.Meta>
                <Card.Content>
                    <p><TournamentPhaseComponent phase={tournament.phase} /></p>
                    {(tournament.phase == TournamentPhase.round) &&
                        <p>Round <b>{tournament.currentRound}</b>/<b>{tournament.totalRounds}</b></p>
                    }
                    <p><TournamentDeadline phase={tournament.phase} deadline={tournament.deadline} /></p>
                    {score && <p>My score: <b>{score.score.toLocaleString()}</b> (wave {score.waves})</p>}
                </Card.Content>
            </Card.Content>
            <Card.Content extra>
                {score
                    ? <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Improve!</Button>
                    : <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Join</Button>
                }
            </Card.Content>
        </Card>
    );
}
