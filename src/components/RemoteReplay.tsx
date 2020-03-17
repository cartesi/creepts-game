// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { FullScreenMessage } from "./FullScreenMessage";
import { navigate } from "hookrouter";
import { GameManager } from "../GameManager";
import { loadLevel, loadMap } from "@cartesi/creepts-mappack";
import { useQueryParams } from "hookrouter";

interface IProps { };

export const RemoteReplay: React.FC<IProps> = () => {

    const [queryParams] = useQueryParams();
    const logUrl = queryParams.log;
    const mapName = queryParams.map || "original";
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>(undefined);

    const load = () => {
        console.log('load');
        setError(undefined);
        setLoading(true);
        fetch(logUrl)
            .then(resp => resp.json())
            .then(log => {
                try {
                    const map = loadMap(mapName);

                    // build level object from map
                    const level = loadLevel(map);

                    setLoading(false);
                    setError(undefined);

                    // open game log replay screen
                    GameManager.enterLogScene(log, level);
                } catch (e) {
                    setLoading(false);
                    setError(e);
                }
            })
            .catch(err => {})
            .finally(() => GameManager.events.removeListener("ready", load));
    };

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        const exitHandler = () => navigate('/');
        GameManager.events.on("ready", load);
        GameManager.events.on("exit", exitHandler);
        return () => {
            GameManager.events.removeListener("exit", exitHandler);
        };
    }, []);
    
    return (
        <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
            {loading && <Loading />}
            {error &&
                <FullScreenMessage
                    title="Error Loading Log"
                    message={error.message}
                    buttonTitle="Exit"
                    onClick={() => navigate('/')} />
            }
        </div>
    );
};
