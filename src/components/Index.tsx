// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useState } from "react";
import { Button, Grid } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AWrapper } from './App';
import { AccountInformation } from './AccountInformation';
import { useAccountService } from '../services/accountService';
import { Loading } from "./Loading";
import { TournamentCard } from "./TournamentCard";
import { useTournamentsService } from "../services/tournamentService";

interface IProps { }

const styles = {
    grid: {
        minHeight: "100vh",
        marginTop: "15px",
        backgroundImage: `url(${"/assets/img/background.png"})`,
        backgroundSize: "100%",
    }
};

export const Index: React.FC<IProps> = (props) => {

    // fetch account information
    const accountService = useAccountService();
    const funded = accountService.status == 'loaded' && accountService.payload.balance > 0;

    // fetch tournaments
    const tournamentService = useTournamentsService();

    // get started button
    const [started, setStarted] = useState(false);
    
    return (
        <Grid container direction="column" alignItems="center" justify="flex-start" style={styles.grid} spacing={1}>
            {accountService.status == "loaded" &&
                <AccountInformation
                    address={accountService.payload.address}
                    balance={accountService.payload.balance}
                />
            }
            <Grid item style={{ flexGrow: 2 }}>
                <img src="/assets/img/logo.png" width="350px" />
            </Grid>
            {accountService.status == "error" &&
            <Grid item>
                <Alert severity="error" variant="outlined" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <AlertTitle>Error querying account information</AlertTitle>
                    {accountService.error.message}
                </Alert>
            </Grid>
            }
            
            {(tournamentService.status == "loading" || accountService.status == "loading") &&
            <Loading />
            }

            {!started &&
            <Grid item>
                <Button onClick={() => setStarted(true)}>Get Started!</Button>
            </Grid>
            }

            {(tournamentService.status === "loaded" && accountService.status === "loaded" && funded && started) &&
                ( tournamentService.payload.results.length > 0 ? 
                    <React.Fragment>
                        {tournamentService.payload.results.map((tournament, index) => (
                            <TournamentCard
                                key={index}
                                tournament={tournament}
                                account={accountService.payload.address}
                            />
                        ))}
                    </React.Fragment> : 
                    <Grid item>
                        <Alert variant="outlined" severity="warning" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>No tournaments</Alert>
                    </Grid>
                )
            }
            {tournamentService.status === "error" && (
            <Grid item>
                <Alert variant="outlined" severity="error" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <AlertTitle>Error querying tournaments</AlertTitle>
                    {tournamentService.error.message}
                </Alert>
            </Grid>
            )}

            <Grid item>
                <img src="/assets/img/footer.png" width="400px" />
            </Grid>
        </Grid>
    );
};
