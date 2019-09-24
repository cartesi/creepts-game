import { useEffect, useState } from "react";
import { Service } from "./service";
import { Tournament, TournamentPhase } from "../Tournament";
import { get } from "./http";
import { apiUrl } from './config';
import queryString from "query-string";

export interface Tournaments {
    results: Tournament[];
}

export const useTournamentService = (id: string) => {
    const [result, setResult] = useState<Service<Tournament>>({
        status: "loading"
    });

    useEffect(() => {
        get<Tournament>(`${apiUrl}/tournaments/${id}`)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody}))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};

export const useTournamentsService = (phase: TournamentPhase, me: boolean) => {
    const [result, setResult] = useState<Service<Tournaments>>({
        status: "loading"
    });

    const qs = queryString.stringify({ phase, me });
    const url = `${apiUrl}/tournaments${qs && '?' + qs}`;

    useEffect(() => {
        get<Tournaments>(url)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody }))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};
