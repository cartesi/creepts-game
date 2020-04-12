// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { Backdrop, Grid } from '@material-ui/core';
import moment from "moment";
import { useContestService } from '../services/contestService';
import { Loading } from "./Loading";
import { Countdown } from "./Countdown";
import { Layover } from "./GameComponents";

interface IProps {
    id: string;
};

export const ContestGameCountdown: React.FC<IProps> = ({ id }) => {

    // control variables
    const [showCountdown, setShowCountdown] = useState(false);

    // fetch contest information
    const contestService = useContestService(id);

    useEffect(() => {
        if (contestService.status === "loaded") {
            if (contestService.payload.startDate) {
                setShowCountdown(moment.utc(contestService.payload.startDate).isAfter(moment.utc()));
            }            
        }
    }, [contestService.status]);

    return (
        <div style={{ height: "100vh", width: "100vw", position: showCountdown ? "absolute" : "static", zIndex: 1 }}>
            {contestService.status === 'loading' && <Loading />}
            <Backdrop open={showCountdown}>
                {contestService.status === 'loaded' && showCountdown &&
                <Layover>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                        <Grid item>{contestService.payload.logo && <img height='60px' src={contestService.payload.logo} />}</Grid>
                        <Grid item container direction="row" spacing={4} alignItems="center" justify="center">
                            <Countdown date={moment.utc(contestService.payload.startDate).toDate()} />
                        </Grid>
                    </Grid>
                </Layover>
                }
            </Backdrop>
        </div>
    );
};
