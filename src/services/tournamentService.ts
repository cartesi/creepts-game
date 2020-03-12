// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { useEffect, useState } from "react";
import { Service } from "./service";
import { Tournament, TournamentPhase } from "../Tournament";
import { get } from "./http";
import { apiUrl } from './config';
import queryString from "query-string";

export interface Tournaments {
    results: Tournament[];
}

export const getTournament = (id: string) => {
    return get<Tournament>(`${apiUrl}/tournaments/${id}`);
}

export const getTournaments = (phase?: TournamentPhase, me?: boolean) => {
    const qs = queryString.stringify({ phase, me });
    const url = `${apiUrl}/tournaments${qs && '?' + qs}`;
    return get<Tournaments>(url);
}

export const useTournamentService = (id: string) => {
    const [result, setResult] = useState<Service<Tournament>>({
        status: "loading"
    });

    useEffect(() => {
        getTournament(id)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody}))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};

export const useTournamentsService = (phase?: TournamentPhase, me?: boolean) => {
    const [result, setResult] = useState<Service<Tournaments>>({
        status: "loading"
    });

    useEffect(() => {
        getTournaments(phase, me)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody }))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};
