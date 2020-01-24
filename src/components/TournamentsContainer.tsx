import React from "react";
import { AppBar, Button, Breadcrumbs, Grid, Link, Toolbar, Typography } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { TournamentCard } from "./TournamentCard";
import { LoadingCard } from "./LoadingCard";
import { TournamentPhase } from "../Tournament";
import { useTournamentsService } from "../services/tournamentService";
import { useAccountService } from "../services/accountService";

interface IState { }
interface IProps { name: string, me?: boolean, phase?: TournamentPhase }

export const TournamentsContainer: React.FC<IProps> = ({ name, phase, me }) => {
    const accountService = useAccountService();
    const tournamentService = useTournamentsService(phase, me);

    return (
        <React.Fragment>

            <AppBar position="static">
                <Toolbar>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" href="/">
                            Home
                        </Link>
                        <Typography color="textPrimary">{name}</Typography>
                    </Breadcrumbs>
                </Toolbar>
            </AppBar>

            {tournamentService.status === "loading" && <div><LoadingCard /></div> }
            {(tournamentService.status === "loaded" && accountService.status === "loaded") &&
                ( tournamentService.payload.results.length > 0 ? 
                    <Grid container direction="column" spacing={2}>
                        {tournamentService.payload.results.map((tournament, index) => (
                            <TournamentCard
                                key={index}
                                tournament={tournament}
                                account={accountService.payload.address}
                            />
                        ))}
                    </Grid> : 
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Alert variant="outlined" severity="warning">No tournaments</Alert>
                        </Grid>                        
                        <Grid item>
                            <Button variant="outlined" color="secondary" fullWidth size="large" href="/join">Join Tournament</Button>
                        </Grid>                        
                    </Grid>
                )
            }
            {tournamentService.status === "error" && (
                <Alert variant="outlined" severity="error">{tournamentService.error.message}</Alert>
            )}
            {accountService.status === "error" && (
                <Alert variant="outlined" severity="error">{accountService.error.message}</Alert>
            )}
        </React.Fragment>
    );
};
