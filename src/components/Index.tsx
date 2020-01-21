import React, { Component } from "react";
import { Button, Grid, Paper } from '@material-ui/core';

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <Grid container direction="column" alignItems="stretch" spacing={2}>
                <Grid item container xs={12} justify="center">
                    <Paper><img width={600} src="/assets/img/art.jpg" /></Paper>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="secondary" fullWidth size="large" href="/play">Play</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="secondary" fullWidth size="large" href="/join">Join Tournament</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="secondary" fullWidth size="large" href="/my">My Tournaments</Button>
                </Grid>
            </Grid>
        );
    }
};
