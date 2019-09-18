import { useEffect, useState } from "react";
import { Service } from "./service";
import { Tournament, TournamentPhase } from "../Tournament";
import fetch from "./fetch";
import queryString from "query-string";

export interface Tournaments {
    results: Tournament[];
}

const useTournamentsService = (phase: TournamentPhase, me: boolean) => {
    const [result, setResult] = useState<Service<Tournaments>>({
        status: "loading"
    });

    const qs = queryString.stringify({ phase, me });
    const url = `/tournaments${qs && '?' + qs}`;

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(response => setResult({ status: "loaded", payload: response }))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};

export default useTournamentsService;
