// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { Box, Grid, Paper } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const LoadingCard: React.FC<{}> = () => {
    return (
        <Grid item>
            <Paper key="loading" variant="outlined" square>
                <Grid container item spacing={0} alignItems="flex-start" justify="flex-end">
                    <Grid item xs>
                        <Grid container direction="column">
                            <Box m={2}>
                                <Skeleton variant="rect" height={30} />
                                <Skeleton variant="text" />
                                <Skeleton variant="rect" width={300} height={200} />
                            </Box>
                        </Grid>                        
                    </Grid>
                    <Grid item>
                        <Box m={2}>
                            <Skeleton variant="rect" width={100} height={120} />
                        </Box>
                    </Grid>
                </Grid>                
            </Paper>
        </Grid>
    );
};
