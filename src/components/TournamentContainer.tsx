// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { LevelObject, LogsObject } from "@cartesi/creepts-engine";
import { GameManager } from "../GameManager";
import { navigate } from "hookrouter";
import { Loading } from "./Loading";
import { FullScreenMessage } from "./FullScreenMessage";
import { useTournamentService } from "../services/tournamentService";
import { putScore } from "../services/scoreService";

interface IProps { id: string }

export const TournamentContainer: React.FC<IProps> = ({ id }) => {

    const maps = [
        "original",
        "waiting_line",
        "turn_round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    // this will control a loading screen
    const [mapLoaded, setMapLoaded] = useState(false);

    // error message after submitting a score
    const [submitError, setSubmitError] = useState<string>(null);

    // load the tournament from the backend
    const service = useTournamentService(id);

    useEffect(() => {
        if (service.status === "loaded") {
            const tournament = service.payload;
            const { map } = tournament;

            // select the map of the tournament
            GameManager.mapSelected(maps.indexOf(map));

            // this will remove the loading screen
            setMapLoaded(true);
        }
    }, [service.status]);

    const gameOverHandler = (level: LevelObject, log: LogsObject, score: number, waves: number) => {
        putScore(id, { score, waves, log })
            .then(response => {
                setSubmitError(response.ok || response.status == 409 ? null : response.statusText);
            })
            .catch(error => {
                setSubmitError(error.message);
            });
    };

    const exitHandler = () => {
        navigate('/');
    }

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        GameManager.events.on("gameOver", gameOverHandler);
        GameManager.events.on("exit", exitHandler)
        return () => {
            GameManager.events.removeListener("gameOver", gameOverHandler);
            GameManager.events.removeListener("exit", exitHandler);
        }
    }, []);

    return (
        // mapLoaded controls the visibility of a loading screen on top of the game
        // which goes aways once the map changes
        <div>
            {!mapLoaded && <Loading />}

            {submitError &&
                <FullScreenMessage
                    title="Error submitting score"
                    message={submitError}
                    buttonTitle="Exit"                
                    onClick={() => navigate('/')} />
            }
        </div>
    );
}
