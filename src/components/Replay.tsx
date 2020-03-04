// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect } from "react";
import { Loading } from "./Loading";
import { FullScreenMessage } from "./FullScreenMessage";
import { useScoreService } from "../services/scoreService";
import { navigate } from "hookrouter";
import { GameManager } from "../GameManager";
import { loadLevel, loadMap } from "@cartesi/creepts-mappack";

interface ReplayProps { tournamentId: string, id: string };

export const Replay: React.FC<ReplayProps> = ({ tournamentId, id }) => {

    // get the score with log from server
    const service = useScoreService(tournamentId, id);

    useEffect(() => {
        if (service.status == "loaded") {
            // get map name from tournament
            const mapName = service.payload[0].map;
            const map = loadMap(mapName);

            // build level object from map
            const level = loadLevel(map);

            // log from server
            const log = service.payload[1].log;

            // open game log replay screen
            GameManager.enterLogScene(log, level);
        }

    }, [service.status]);

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        const exitHandler = () => navigate('/');
        GameManager.events.on("exit", exitHandler);
        return () => GameManager.events.removeListener("exit", exitHandler);
    }, []);
    
    return (
        <div>
            {service.status == "loading" && <Loading progress={service.progress} />}
            {service.status == "error" &&
                <FullScreenMessage
                    title="Error Loading Log"
                    message={service.error.message}
                    buttonTitle="Exit"
                    onClick={() => navigate('/')} />
            }
        </div>
    );
};
