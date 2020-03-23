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
import Units from 'ethereumjs-units';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LockIcon from '@material-ui/icons/Lock';

interface IProps {
    address: string,
    network_id: string,
    balance: number
};

export const AccountInformation: React.FC<IProps> = ({ address, network_id, balance }) => {
    const blackBackground = 'rgba(0,0,0,0.7)';
    const backgroundColor = balance > 0 ? blackBackground : 'rgba(255,0,0,0.7)';

    const networkNames = {
        '3': 'Ropsten',
        '4': 'Rinkeby',
        '42': 'Kovan',
        '15001': 'Matic TESTNET'
    };

    const faucetUrls = {
        '3': 'https://faucet.ropsten.be',
        '4': 'https://faucet.rinkeby.io',
        '42': 'https://github.com/kovan-testnet/faucet',
        '15001': 'https://faucet.matic.network'
    };

    const balanceLabel = Units.convert(balance.toString(), 'wei', 'eth') + ' ETH';
    const networkLabel = networkNames[network_id] ? `${networkNames[network_id]}: ` : '';
    const errorLabel = balance > 0 ? '' : ' (you need funds to play)';
    const label = networkLabel + balanceLabel + errorLabel;

    const clickHandler = balance > 0 || !faucetUrls[network_id] ? undefined : () => {
        window.open(faucetUrls[network_id], '_blank');
    };

    return (
        <React.Fragment>
            <Grid item>
                <Chip icon={<LockIcon />} label={address} variant="outlined" style={{ backgroundColor: blackBackground }} />
                <Chip icon={<AccountBalanceWalletIcon />} label={label} variant="outlined" style={{ backgroundColor }} onClick={clickHandler} />
            </Grid>
        </React.Fragment>
    );
};
