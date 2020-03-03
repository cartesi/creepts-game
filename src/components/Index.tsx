// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { Component } from "react";
import { Button, Grid } from '@material-ui/core';
import { AWrapper } from './App';

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

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <Grid container direction="column" alignItems="center" justify="space-between" style={styles.grid}>
                <Grid item>
                    <img src="/assets/img/logo.png" width="350px" />
                </Grid>
                <Grid item>
                    <Button fullWidth size="large" href="/play" component={AWrapper}>Play</Button>
                    <Button fullWidth size="large" href="/join" component={AWrapper}>Join Tournament</Button>
                    <Button fullWidth size="large" href="/my" component={AWrapper}>My Tournaments</Button>
                </Grid>
                <Grid item>
                    <img src="/assets/img/footer.png" width="400px" />
                </Grid>
            </Grid>
        );
    }
};
