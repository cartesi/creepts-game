// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { Button, Card, Grid, CardContent, Typography, CardActionArea, CardMedia, CardActions } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from "moment";
import { useContestsService, Contest } from '../services/contestService';
import { Loading } from "./Loading";
import { MapThumbnail } from "./MapThumbnail";

interface IProps {
};

interface IContestCardProps {
    contest: Contest;
}

const ContestCard: React.FC<IContestCardProps> = ({ contest }) => {
    const now = moment();
    const canPlay = (!contest.deadline || moment(contest.deadline).isAfter(now)) && (!contest.startDate || moment(contest.startDate).isBefore(now));
    const over = contest.deadline && moment(contest.deadline).isBefore(now);
    const upcoming = contest.startDate && moment(contest.startDate).isAfter(now);
    return (
        <Card>
            {contest.logo &&
            <CardActionArea>
                <CardMedia><img height={20} src={contest.logo} /></CardMedia>
            </CardActionArea>
            }
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">{contest.name}</Typography>
                <MapThumbnail map={contest.map} width={120} height={150} />
            </CardContent>
            <CardActions>
                {canPlay && <Button size="small" href={`/contests/${contest.id}`}>Play</Button>}
                {over && <Button style={{ color: "red" }}>Over</Button>}
                {upcoming && <Button size="small" disabled>Play</Button>}
            </CardActions>
        </Card>
    );
};

export const ContestSelection: React.FC<IProps> = () => {

    // fetch contest information
    const contestsService = useContestsService();

    return (
        <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
            {contestsService.status === "loading" && <Loading />}
            {contestsService.status === "loaded" && (
                <Grid container>
                    {contestsService.payload.map(contest => {
                        return <Grid item key={contest.id}><ContestCard contest={contest} /></Grid>
                    })}
                </Grid>
            )}
        </div>
    );
};
