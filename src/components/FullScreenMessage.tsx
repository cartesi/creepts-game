// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { Backdrop, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

interface IProps {
    title: string,
    message: string,
    buttonTitle: string,
    onClick: () => void,
    opacity?: number
};

export const FullScreenMessage: React.FC<IProps> = ({ title, message, buttonTitle, onClick, opacity = 1.0 }) => {
    return (
        <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1, opacity: opacity }}>
            <Backdrop open={true}>
                <Alert variant="outlined" severity="error" action={
                    <Button color="inherit" size="small" onClick={ onClick }>{buttonTitle}</Button>
                }>
                    <AlertTitle>{title}</AlertTitle>
                    {message}                    
                </Alert>
            </Backdrop>
        </div>
    );
};
