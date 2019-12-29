import React from "react";
import { AppBar, Breadcrumbs, Grid, Link, Toolbar, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { TournamentCard } from "./TournamentCard";
import { LoadingCard } from "./LoadingCard";
import { TournamentPhase } from "../Tournament";
import { useTournamentsService } from "../services/tournamentService";

interface IState { }
interface IProps { name: string, me?: boolean, phase?: TournamentPhase }

export const TournamentsContainer: React.FC<IProps> = ({ name, phase, me }) => {
    const service = useTournamentsService(phase, me);

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

            {service.status === "loading" && <div><LoadingCard /></div> }
            {service.status === "loaded" && 
                <Grid container direction="column" spacing={2}>
                    {service.payload.results.map((tournament, index) => (
                        <TournamentCard
                            key={index}
                            tournament={tournament}
                        />
                    ))}
                </Grid>
            }
            {service.status === "error" && (
                <Alert variant="outlined" severity="error">{service.error.message}</Alert>
            )}
        </React.Fragment>
    );
};
