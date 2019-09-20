import React from "react";
import moment from "moment";
import { A } from "hookrouter";
import { Button, Card, Label } from "semantic-ui-react";
import { MapThumbnail } from "./MapThumbnail";
import { Tournament, TournamentScore, TournamentPhase } from "../Tournament";

export interface TournamentCardProps {
    tournament: Tournament,
    score?: TournamentScore,
    opponentScore?: TournamentScore,
    winningScore?: TournamentScore
}

const TournamentPhaseComponent: React.SFC<{ phase: TournamentPhase }> = ({ phase }) => {
    return (
        <Label.Group size="mini">
            <Label horizontal active={phase == TournamentPhase.commit} pointing="right">Commit</Label>
            <Label horizontal active={phase == TournamentPhase.reveal} pointing="right">Reveal</Label>
            <Label horizontal active={phase == TournamentPhase.round} pointing="right">Round</Label>
            <Label horizontal active={phase == TournamentPhase.end}>End</Label>
        </Label.Group>
    );
};

const TournamentDeadline: React.SFC<{ phase: TournamentPhase, deadline: Date }> = ({ phase, deadline }) => {
    switch(phase) {
        case TournamentPhase.commit:
            return <p>Reveal phase {moment(deadline).fromNow()}</p>
        case TournamentPhase.reveal:
            return <p>Round phase {moment(deadline).fromNow()}</p>
        case TournamentPhase.round:
            return <p>Next round {moment(deadline).fromNow()}</p>
        default:
            return null;
    }
}

export const TournamentCard: React.SFC<TournamentCardProps> = ({ tournament }) => {
    // TODO: move this
    const me = "0x036f5cf5ca56c6b5650c9de2a41d94a3fe1e2077";

    const score = tournament.scores && tournament.scores[me];
    const opponentScore = tournament.scores && tournament.currentOpponent ? tournament.scores[tournament.currentOpponent] : null;
    const winningScore = tournament.scores && tournament.winner ? tournament.scores[tournament.winner] : null;

    return (
        <Card key={tournament.id} raised fluid>
            <Card.Content>
                <Card.Meta className="right floated"><MapThumbnail map={tournament.map} width={60} height={72} /></Card.Meta>
                <Card.Header>{tournament.name}</Card.Header>
                <Card.Meta>
                    {tournament.playerCount === 0 && "No players yet"}
                    {tournament.playerCount === 1 && `${tournament.playerCount} player`}
                    {tournament.playerCount > 1 && `${tournament.playerCount} players`}
                </Card.Meta>
                <Card.Content>
                    <TournamentPhaseComponent phase={tournament.phase} />
                    {(tournament.phase === TournamentPhase.round) &&
                        <p>Round <b>{tournament.currentRound}</b>/<b>{tournament.totalRounds}</b></p>
                    }
                    <TournamentDeadline phase={tournament.phase} deadline={tournament.deadline} />
                    {score && <p>My score: <b>{score.score.toLocaleString()}</b> (wave {score.waves})</p>}
                    {opponentScore && <p>Opponent: <b>{opponentScore.score.toLocaleString()}</b> (wave {opponentScore.waves})</p>}
                    {winningScore && <p>Winner 🏆: <b>{winningScore.score.toLocaleString()}</b> (wave {winningScore.waves})</p>}
                </Card.Content>
            </Card.Content>
            <Card.Content extra>
                {score && tournament.phase === TournamentPhase.commit &&
                    <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Improve!</Button>}

                {!score && tournament.phase === TournamentPhase.commit &&
                    <Button as={A} href={`/tournaments/${tournament.id}`} fluid>Join</Button>}

                {tournament.phase === TournamentPhase.round &&
                    <Button as={A} href={`/tournaments/${tournament.id}/scores/${tournament.currentOpponent}`} fluid>Replay opponent!</Button>}

                {tournament.phase === TournamentPhase.reveal &&
                    <Button fluid>Submit!</Button>}

                {tournament.phase === TournamentPhase.end &&
                    <Button as={A} href={`/tournaments/${tournament.id}/scores/${tournament.winner}`} fluid>Replay winner! 🏆</Button>}
            </Card.Content>
        </Card>
    );
}
