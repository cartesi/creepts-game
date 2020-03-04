// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Full screen loading with a 1 z-index
 */

interface LoadingProps { progress?: number, opacity?: number };

export const Loading: React.FC<LoadingProps> = ({ progress, opacity = 1.0 }) => {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            opacity: opacity,
            zIndex: 1
            }}>
            <Backdrop open={true}>
                <CircularProgress
                    color="secondary"
                    variant={progress ? "static" : "indeterminate"}
                    value={progress} />
            </Backdrop>
        </div>
    );
};
