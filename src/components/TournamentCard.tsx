// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import moment from "moment";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Box, Button, Chip, Grid, Paper, Stepper, Step, StepContent, StepLabel, Typography } from '@material-ui/core';
import { AWrapper } from "./App";
import { MapThumbnail } from "./MapThumbnail";
import { ReadMore } from "./ReadMore";
import { Tournament, TournamentScore, TournamentPhase } from "../Tournament";

import AlarmIcon from '@material-ui/icons/Alarm';
import HelpIcon from '@material-ui/icons/Help';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import GradeIcon from '@material-ui/icons/Grade';

interface ITournamentCardProps {
    account: string,
    balance: number,
    tournament: Tournament,
    score?: TournamentScore,
    opponentScore?: TournamentScore,
    winningScore?: TournamentScore
};

interface ITournamentPhaseProps {
    tournament: Tournament,
    account: string,
    balance: number
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        }
    }),
);

const TournamentPhaseComponent: React.SFC<ITournamentPhaseProps> = ({ account, balance, tournament }) => {
    const { phase } = tournament;

    const score = tournament.scores && tournament.scores[account];
    const opponentScore = tournament.scores && tournament.currentOpponent ? tournament.scores[tournament.currentOpponent] : null;
    const winningScore = tournament.scores && tournament.winner ? tournament.scores[tournament.winner] : null;

    const steps = [TournamentPhase.commit, TournamentPhase.reveal, TournamentPhase.round, TournamentPhase.end];

    // convert deadline string to moment object
    const deadline = moment(tournament.deadline);
    const now = moment();
    
    // player can play if tournament is still in commit phase and deadline is ahead of now, and he has funds
    const canPlay: boolean = phase == TournamentPhase.commit && (deadline > now);

    // label of deadline
    const deadlineLabel = deadline > now ? `${deadline.fromNow(true)} left` : `expired ${deadline.fromNow(true)} ago`;

    const classes = useStyles({});
    return (
        <Stepper activeStep={steps.indexOf(phase)} orientation="vertical" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
            <Step key="commit">
                <StepLabel>Commit</StepLabel>
                <StepContent>
                    <Typography>During the commit phase you can play the game.</Typography>
                    <ReadMore label="Learn more">
                        <Typography>After you die your actions during the game and your score are submitted to your Cartesi node, and later sent to the blockchain during the Reveal phase. If you think you can do better you can play again, your node will submit the best score you get.</Typography>
                    </ReadMore>
                    <Grid container spacing={1} alignItems="center">
                        {canPlay && <Grid item><Button
                            color="secondary"
                            variant="outlined"
                            disabled={balance == 0}
                            startIcon={<VideogameAssetIcon />}
                            component={AWrapper}
                            href={`/tournaments/${tournament.id}`}>
                            {score ? `Play Again` : 'Play'}
                        </Button></Grid>}
                        {score && <Grid item><Chip icon={<GradeIcon />} size="medium" label={`${score.score.toLocaleString()} points`} /></Grid>}
                        <Grid item><Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} /></Grid>
                    </Grid>
                </StepContent>
            </Step>
            <Step key="reveal">
                <StepLabel>Reveal</StepLabel>
                <StepContent>
                    <Typography>During the reveal phase your game actions and your score are sent to the blockchain.</Typography>
                    <ReadMore label="Learn more">
                        <Typography>Your game actions are uploaded to the blockchain and your score is calculated by your Cartesi node emulator. At this point, the scores of all players are revealed and from this point on, no one is allowed to try to improve their scores. The next phase will be reponsible to confront every player pairwise to declare the winner.</Typography>
                    </ReadMore>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item><Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} /></Grid>
                    </Grid>
                </StepContent>
            </Step>
            <Step key="round">
                <StepLabel>Round</StepLabel>
                <StepContent>
                    <Typography>During this phase a pair of players is confronted to eliminate the lower score.</Typography>
                    <ReadMore label="Learn more">
                        <Typography>Players are organized into a bracket structure and each pair of players are confronted. If your opponent is cheating a iteractive verification game is automatically triggered by our Cartesi node to eliminate the cheater.</Typography>
                    </ReadMore>
                    <Grid container spacing={1} alignItems="center">
                        {opponentScore &&
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="outlined"
                                component={AWrapper}
                                href={`/tournaments/${tournament.id}/scores/${tournament.currentOpponent}`}
                                startIcon={<OndemandVideoIcon />}>
                                Opponent
                            </Button>
                        </Grid>}
                        {opponentScore && <Grid item><Chip icon={<EmojiEventsIcon />} size="medium" label={`${opponentScore.score.toLocaleString()} points`} /></Grid>}
                        <Grid item><Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} /></Grid>
                    </Grid>
                </StepContent>
            </Step>
            <Step key="end">
                <StepLabel>End</StepLabel>
                <StepContent>
                    <Typography>This is the end of the tournament and a winner is declared!</Typography>
                    <ReadMore>
                        <Typography>When all pairs of players are confronted only one player is left, he is declared the winner. His gameplay can be replayed.</Typography>
                    </ReadMore>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="outlined"
                                component={AWrapper}
                                href={`/tournaments/${tournament.id}/scores/${tournament.winner}`}
                                startIcon={<EmojiEventsIcon />}>
                                Winner
                            </Button>
                        </Grid>
                        {winningScore && <Grid item><Chip icon={<EmojiEventsIcon />} size="medium" label={`${winningScore.score.toLocaleString()} points`} /></Grid>}
                    </Grid>
                </StepContent>
            </Step>
        </Stepper>
    );
};

export const TournamentCard: React.SFC<ITournamentCardProps> = ({ account, balance, tournament }) => {

    const playersText = tournament.playerCount === 0 ? "No players yet" : (tournament.playerCount === 1 ? `${tournament.playerCount} player` : `${tournament.playerCount} players`);
    return (
        <Grid item>
            <Paper key={tournament.id} variant="outlined" square>
                <Grid container item spacing={0} alignItems="flex-start" justify="flex-end">
                    <Grid item xs>
                        <Grid container direction="column">
                            <Box m={2}>
                                <Typography variant="h5">{tournament.name}</Typography>
                                <Typography>{playersText}</Typography>
                                <TournamentPhaseComponent account={account} balance={balance} tournament={tournament} />
                            </Box>
                        </Grid>                        
                    </Grid>
                    <Grid item>
                        <Box m={2}>
                            <MapThumbnail map={tournament.map} width={100} height={120} />
                        </Box>
                    </Grid>
                </Grid>                
            </Paper>
        </Grid>
    );
};
