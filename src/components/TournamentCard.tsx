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
import { Tournament, TournamentScore, TournamentPhase } from "../Tournament";

import AlarmIcon from '@material-ui/icons/Alarm';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';

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
        },
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginBottom: theme.spacing(1),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
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
    const canPlay: boolean = phase == TournamentPhase.commit && (deadline > now) && balance > 0;

    // label of deadline
    const deadlineLabel = deadline > now ? `${deadline.fromNow(true)} left` : `expired ${deadline.fromNow(true)} ago`;

    const classes = useStyles({});
    return (
        <Stepper activeStep={steps.indexOf(phase)} orientation="vertical">
            <Step key="commit">
                <StepLabel>Commit</StepLabel>
                <StepContent>
                    <Typography>The player can choose to participate in any tournament. The selection will set the maze and the player will be able to play repeated times in order to improve their score; At the end of each game, information about the score and player moves are sent to the blockchain.</Typography>
                    <div className={classes.actionsContainer}>
                        <div>
                            {canPlay && <Button
                                color="secondary" 
                                variant="outlined"
                                className={classes.button} 
                                startIcon={<VideogameAssetIcon />}
                                component={AWrapper}
                                href={`/tournaments/${tournament.id}`}>
                                {score ? `Play Again` : 'Play'}
                            </Button>}
                            {score && <Chip icon={<EmojiEventsIcon />} size="medium" label={`${score.score.toLocaleString()} points`} />}
                            <Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} />
                        </div>
                    </div>
                </StepContent>
            </Step>
            <Step key="reveal">
                <StepLabel>Reveal</StepLabel>
                <StepContent>
                    <Typography>At this point, the score of each player is overtly revealed on the blockchain and from this point on, no one is allowed to try and improve their scores.</Typography>
                    <div className={classes.actionsContainer}>
                        <div>
                            <Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} />
                        </div>
                    </div>
                </StepContent>
            </Step>
            <Step key="round">
                <StepLabel>Round</StepLabel>
                <StepContent>
                    <Typography>This is the phase in which the single-elimination process happens. Player claims are organized on a bracket structure where the loser of each match-up is immediately eliminated. Each winner is promoted to the next round in the bracket until the final match-up, whose winner becomes the tournament champion.</Typography>
                    <div className={classes.actionsContainer}>
                        <div>
                            {opponentScore && <Button
                                color="secondary"
                                variant="outlined"
                                className={classes.button}
                                component={AWrapper}
                                href={`/tournaments/${tournament.id}/scores/${tournament.currentOpponent}`}
                                startIcon={<OndemandVideoIcon />}>
                                Opponent
                            </Button>}
                            {opponentScore && <Chip icon={<EmojiEventsIcon />} size="medium" label={`${opponentScore.score.toLocaleString()} points`} />}
                            <Chip icon={<AlarmIcon />} size="medium" label={deadlineLabel} />
                        </div>
                    </div>
                </StepContent>
            </Step>
            <Step key="end">
                <StepLabel>End</StepLabel>
                <StepContent>
                    <Typography>The tournament enters the end state when the last match-up is concluded with a winner. From this point on, all players involved in the tournament are able to replay the game of the winner.</Typography>
                    <div className={classes.actionsContainer}>
                        <div>
                            <Button
                                color="secondary"
                                variant="outlined"
                                className={classes.button}
                                component={AWrapper}
                                href={`/tournaments/${tournament.id}/scores/${tournament.winner}`}
                                startIcon={<EmojiEventsIcon />}>
                                Winner
                            </Button>
                            {winningScore && <Chip icon={<EmojiEventsIcon />} size="medium" label={`${winningScore.score.toLocaleString()} points`} />}
                        </div>
                    </div>
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
