import { useState, useEffect } from "react";
import { Service } from "./service";
import { get, put } from "./http";
import { apiUrl } from "./config";
import { TournamentScore } from "../Tournament";

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

export const useScoreService = (tournamentId: string, id: string) => {
    const [result, setResult] = useState<Service<TournamentScore>>({
        status: "loading"
    });

    useEffect(() => {
        getScore(tournamentId, id)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody}))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};
