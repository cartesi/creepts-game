// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from 'react';
import { Chip, Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Units from 'ethereumjs-units';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LockIcon from '@material-ui/icons/Lock';

interface IProps {
    address: string,
    balance: number
};

export const AccountInformation: React.FC<IProps> = ({ address, balance }) => {
    const blackBackground = 'rgba(0,0,0,0.7)';
    const backgroundColor = balance > 0 ? blackBackground : 'rgba(255,0,0,0.7)';
    const balanceLabel = balance > 0 ? `${Units.convert(balance.toString(), 'wei', 'eth')} ETH` : '0 ETH (you need funds to play)';
    return (
        <React.Fragment>
            <Grid item>
                <Chip icon={<LockIcon />} label={address} variant="outlined" style={{ backgroundColor: blackBackground }} />
            </Grid>
            <Grid item>
                <Chip icon={<AccountBalanceWalletIcon />} label={balanceLabel} variant="outlined" style={{ backgroundColor }} />
            </Grid>
        </React.Fragment>
    );
};
