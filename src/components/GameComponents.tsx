// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    layover: {
        backgroundColor: 'rgba(0,0,90,0.7)',
        width: '100vw',
        padding: theme.spacing(3)
    },
    layoverTitle: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Regular',
        fontSize: '30px',
        backgroundImage: 'radial-gradient(rgba(0,0,255,0), rgba(0,0,255,0.6))',
    },
    h1: {
        fontSize: '65px',
        fontFamily: 'Rubik-Regular',
    },
}));

export const LayoverTitle: React.FC<{}> = (props) => {
    const classes = useStyles();
    return (
        <p style={{ textAlign: 'center' }}>
            <span className={classes.layoverTitle}>
                {props.children}
            </span>
        </p>
    );
};

export const LayoverHeading: React.FC<{}> = (props) => {
    const classes = useStyles();
    return (
        <p style={{ textAlign: 'center' }}>
            <span className={classes.h1}>
                {props.children}
            </span>
        </p>
    );
};

export const Layover: React.FC<{}> = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.layover}>
            {props.children}
        </div>
    );
};
