// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { useState, useEffect, useRef } from "react";
import { Service } from "./service";
import { get, put } from "./http";
import { apiUrl } from "./config";
import { getTournament } from "./tournamentService";
import { Tournament, TournamentScore } from "../Tournament";

export const putScore = (tournamentId: string, payload: TournamentScore) => {
    return put<TournamentScore>(`${apiUrl}/tournaments/${tournamentId}/scores/my`, payload);
}

export const getScore = (tournamentId: string, id: string) => {
    return get<TournamentScore>(`${apiUrl}/tournaments/${tournamentId}/scores/${id}`);
}

export const useScoreSubmitService = (tournamentId: string, payload: TournamentScore) => {
    const [result, setResult] = useState<Service<TournamentScore>>({
        status: "loading"
    });

    useEffect(() => {
        putScore(tournamentId, payload)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody}))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};

const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef<() => void>();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const useScoreService = (tournamentId: string, id: string) => {
    const [result, setResult] = useState<Service<[Tournament, TournamentScore]>>({ status: "loading" });
    const [continuePolling, setContinuePolling] = useState(true);

    // download of log takes time, we must poll every N milliseconds
    const pollingInterval = 1000;

    const fetchData = () => {
        // first get the tournament
        getTournament(tournamentId)
            .then(response => {
                const tournament = response.parsedBody;

                getScore(tournamentId, id)
                    .then(response => {
                        if (response.status == 202) {
                            const body = response.parsedBody;
                            setResult({ status: "loading", progress: body.progress });
                        } else {
                            setResult({ status: "loaded", payload: [tournament, response.parsedBody] });
                            setContinuePolling(false);
                        }                        
                    })
                    .catch(error => {
                        setResult({ status: "error", error: new Error("score: " + error.message) });
                        setContinuePolling(false);
                    });
            })
            .catch(error => {
                setResult({ status: "error", error: new Error("tournament: " + error.message) });
                setContinuePolling(false);
            });
    };

    useInterval(fetchData, continuePolling ? pollingInterval : null);

    return result;
};
