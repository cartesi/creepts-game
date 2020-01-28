import React, { Component } from "react";
import { Button, Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

interface IState { }
interface IProps { }

const styles = {
    grid: {
        height: "100vh",
        padding: "30px",
        backgroundImage: `url(${"/assets/img/background.png"})`,
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
    }
};

const ActionButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, rgba(0,0,0,0.8), rgba(26,35,126,0.8))',
        borderColor: '#2196f3',
        color: '#2196f3',
        height: 48,
        padding: '0 30px',
        '&:hover': {
            border: '3px solid',
        }
    },
})(Button);

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <Grid container direction="column" alignItems="center" justify="space-between" style={styles.grid}>
                <Grid item>
                    <img src="/assets/img/logo.png" width="350px" />
                </Grid>
                <Grid item>
                    <ActionButton fullWidth size="large" href="/play">Play</ActionButton>
                    <ActionButton fullWidth size="large" href="/join">Join Tournament</ActionButton>
                    <ActionButton fullWidth size="large" href="/my">My Tournaments</ActionButton>
                </Grid>
                <Grid item>
                    <img src="/assets/img/footer.png" width="400px" />
                </Grid>
            </Grid>
        );
    }
};
