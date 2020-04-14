// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { Backdrop, Button, Grid, LinearProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui'; 
import { navigate } from "hookrouter";
import moment from "moment";
import { useContestService, submitContestEntry } from '../services/contestService';
import { Loading } from "./Loading";
import { Countdown } from "./Countdown";
import { Layover, LayoverTitle, LayoverHeading } from "./GameComponents";
import { GameManager } from "../GameManager";
import { LevelObject, LogsObject } from "@cartesi/creepts-engine";
import { GameVars } from "../GameVars";

interface IProps {
    id: string;
};

interface GameOverProps {
    score: number;
    waves: number;
    log: LogsObject;
};

export const ContestGame: React.FC<IProps> = ({ id }) => {

    const maps = [
        "original",
        "waiting_line",
        "turn_round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    // control variables
    const [gameReady, setGameReady] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // fetch contest information
    const contestService = useContestService(id);

    // this will control a loading screen
    const [mapLoaded, setMapLoaded] = useState(false);
    // const [gameOver, setGameOver] = useState<GameOverProps>({ score: 999999, waves: 999, log: { actions: [] } });
    const [gameOver, setGameOver] = useState<GameOverProps>(undefined);

    // save gameover state
    const onGameOver = (level: LevelObject, log: LogsObject, score: number, waves: number) => {
        setGameOver({ score, waves, log });
    };

    const restart = () => {
        if (gameReady) {
            setSubmitted(false);
            setError('');
            setGameOver(undefined);
            GameManager.reset();
        }
    };

    // submit score
    const submit = (values, { setSubmitting }) => {
        if (contestService.status === 'loaded') {
            // reset state
            setSubmitted(false);
            setError('');

            // post game
            submitContestEntry(
                contestService.payload.id,
                values.contestantId,
                gameOver.score,
                gameOver.waves,
                gameOver.log
            )
            .then(response => {
                if (response.ok) {
                    setSubmitted(true);
                    setSubmitting(false);
                    setError('');
                } else {
                    setSubmitted(false);
                    setSubmitting(false);
                    setError(response.statusText);
                }
            })
            .catch(err => {
                setSubmitted(false);
                setSubmitting(false);
                setError(err.message);
            });
        }
    };

    // hook game events
    useEffect(() => {
        // we can only interact with GameManager if game is ready
        const onGameReady = () => setGameReady(true);

        // navigate away
        const onExit = () => navigate('/');

        GameVars.showGameOverLayer = false;
        GameManager.events.on("ready", onGameReady);
        GameManager.events.on("exit", onExit);
        GameManager.events.on('gameOver', onGameOver);
        return () => {
            // cleanup hooks
            GameVars.showGameOverLayer = true;
            GameManager.events.removeListener("ready", onGameReady);
            GameManager.events.removeListener("exit", onExit);
            GameManager.events.removeListener("gameOver", onGameOver);
        };
    }, []);

    useEffect(() => {
        if (contestService.status === "loaded" && gameReady) {
            // get map from contest information
            const map = contestService.payload.map;
            
            // select the map of the contest
            GameManager.mapSelected(maps.indexOf(map));

            // this will remove the loading screen
            setMapLoaded(true);

            if (contestService.payload.startDate) {
                setShowCountdown(moment.utc(contestService.payload.startDate).isAfter(moment.utc()));
            }
            
        } else if (contestService.status === "error") {
            setMapLoaded(true);
        }
    }, [contestService.status, gameReady]);

    // ID validattion function
    const validate = (pattern: string) => (values) => {
        if (!values.contestantId) {
            return { contestantId: 'Required' };
        } else if (pattern) {
            const regex = new RegExp(pattern);
            if (!regex.test(values.contestantId)) {
                return { contestantId: 'Invalid Binance Referral ID' };
            }
        }
        return {};
    };

    return (
        <div style={{ height: "100vh", width: "100vw", position: gameOver || showCountdown ? "absolute" : "static", zIndex: 1 }}>
            {!mapLoaded && <Loading />}
            <Backdrop open={!!gameOver || showCountdown}>
                {contestService.status === 'loaded' && showCountdown &&
                <Layover>
                    <Grid container direction="column" justify="flex-start" alignItems="center" spacing={4}>
                        <Grid item><LayoverTitle>{contestService.payload.name} starts in:</LayoverTitle></Grid>
                        <Grid item><Countdown date={moment.utc(contestService.payload.startDate).toDate()} /></Grid>
                    </Grid>
                </Layover>
                }
                {contestService.status === 'loaded' && gameOver && (
                <Layover>
                    {!!gameOver && <Formik
                        initialValues={{ contestantId: '' }}
                        validate={validate('^\\d{8}$')}
                        onSubmit={submit}
                    >
                        {({ submitForm, isSubmitting, errors }) => (
                            <Form translate="">
                                <Grid container direction="column" justify="flex-start" alignItems="center" spacing={1}>
                                    <Grid item><LayoverTitle>Game Over</LayoverTitle></Grid>
                                    <Grid item><LayoverHeading>SCORE: {gameOver.score.toLocaleString()}</LayoverHeading></Grid>
                                    <Grid item>{contestService.payload.logo && <img height='60px' src={contestService.payload.logo} />}</Grid>
                                    <Grid item><LinearProgress color="secondary" style={{ width: '100vw', visibility: isSubmitting ? "visible" : "hidden" }} /></Grid>
                                    {submitted && <Grid item><Alert severity="success" variant="outlined">Score submitted!</Alert></Grid>}
                                    {error && <Grid item><Alert severity="error" variant="outlined">{error}</Alert></Grid>}
                                    {!submitted && (<Grid item container justify='center' alignItems='flex-start' spacing={2}>
                                        <Grid item>
                                            <Field
                                                component={TextField}
                                                name="contestantId"
                                                required
                                                disabled={isSubmitting}
                                                label={contestService.payload.contestantLabel}
                                                variant="filled"
                                                size="small"
                                                helperText={<span>Get your Binance Referral ID <a style={{ color: '#fff' }} href='https://www.binance.com/en/activity/referral' target='_blank'>here</a></span>}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button variant='outlined' onClick={submitForm} disabled={isSubmitting || (errors.contestantId !== undefined)}>Submit</Button>
                                        </Grid>
                                    </Grid>)}
                                    <Grid item><Button variant='outlined' color="secondary" onClick={restart}>Play Again</Button></Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>}
                </Layover>
                )}
            </Backdrop>
        </div>
    );
};
