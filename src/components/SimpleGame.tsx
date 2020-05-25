// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { maps } from "@cartesi/creepts-mappack";
import { navigate } from "hookrouter";
import { Loading } from "./Loading";
import { GameManager } from "../GameManager";

interface IProps {
    map: string;
};

export const SimpleGame: React.FC<IProps> = ({ map }) => {

    // control variables
    const [gameReady, setGameReady] = useState(false);

    // hook game events
    useEffect(() => {
        // we can only interact with GameManager if game is ready
        const onGameReady = () => setGameReady(true);

        // navigate away
        const onExit = () => navigate('/');

        GameManager.events.on("ready", onGameReady);
        GameManager.events.on("exit", onExit);
        return () => {
            // cleanup hooks
            GameManager.events.removeListener("ready", onGameReady);
            GameManager.events.removeListener("exit", onExit);
        };
    }, []);

    // select correct map based on contest
    useEffect(() => {
        if (gameReady) {
            // select the map of the contest
            GameManager.mapSelected(maps().indexOf(map));
        }
    }, [gameReady]);

    return (
        <div style={{ height: "100vh", width: "100vw", position: "static", zIndex: 1, visibility: gameReady ? 'hidden' : 'visible' }}>
            {!gameReady && <Loading />}
        </div>
    );
};
