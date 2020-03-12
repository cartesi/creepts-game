// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { Button, Grid, Paper } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AWrapper } from './App';
import { AccountInformation } from './AccountInformation';
import { useAccountService } from '../services/accountService';
import { Loading } from "./Loading";

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

export const Index: React.FC<IProps> = (props) => {

    // fetch account information
    const accountService = useAccountService();
    const funded = accountService.status == 'loaded' && accountService.payload.balance > 0;
    
    return (
        <Grid container direction="column" alignItems="center" justify="space-between" style={styles.grid}>
            {accountService.status == "loaded" &&
                <AccountInformation
                    address={accountService.payload.address}
                    balance={accountService.payload.balance}
                />
            }
            <Grid item style={{ flexGrow: 2 }}>
                <img src="/assets/img/logo.png" width="350px" />
            </Grid>
            <Grid item>
                <Grid container item direction="column" alignItems="center" style={{ padding: '10px' }} spacing={1}>
                    {accountService.status == 'loading' &&
                    <Loading />
                    }
                    {accountService.status == 'error' && 
                    <Alert severity="error" variant="outlined" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        {accountService.error.message}
                    </Alert>
                    }
                </Grid>
            </Grid>
            {funded &&
            <Grid item>
                <Button fullWidth size="large" href="/play" component={AWrapper}>Play</Button>
                <Button fullWidth size="large" href="/join" component={AWrapper}>Join Tournament</Button>
                <Button fullWidth size="large" href="/my" component={AWrapper}>My Tournaments</Button>
            </Grid>
            }
            <Grid item>
                <img src="/assets/img/footer.png" width="400px" />
            </Grid>
        </Grid>
    );
};
