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
