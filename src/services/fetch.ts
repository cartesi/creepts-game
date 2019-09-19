import allTournaments from "./tournaments.json";
import queryString from "query-string";
import { TournamentPhase, Tournament } from "../Tournament";

// artificial delay, for testing purposes
const DELAY = 300;
const response404 = new Response(null, { status: 404, statusText: "Not Found" });

const tournamentHandler = (url: string, id: string) => {
    return new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
            const tournament = allTournaments.results.find((t: any) => t.id === id);
            if (!tournament) {
                resolve(response404);
            } else {
                const body = JSON.stringify(tournament);
                const response = new Response(body);
                resolve(response);
            }
        }, DELAY);
    });
}

const tournamentsHandler = (url: string) => {
    // TODO: move this
    const address = "0x036f5cf5ca56c6b5650c9de2a41d94a3fe1e2077";

    const parsedUrl = queryString.parseUrl(url);
    const phaseFilter = (phase: TournamentPhase) => (t: any) => {
        return t.phase == phase;
    }
    const meFilter = (me: boolean) => (t: any) => {
        const scores = t.scores || {};
        return me ? scores[address] : !scores[address];
    };

    let tournaments = allTournaments.results;
    if (parsedUrl.query.phase) {
        tournaments = tournaments.filter(phaseFilter(TournamentPhase[parsedUrl.query.phase as string]));
    }
    tournaments = tournaments.filter(meFilter(parsedUrl.query.me === "true"));

    return new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
            const body = JSON.stringify({ ...allTournaments, results: tournaments});
            const response = new Response(body);
            resolve(response);
        }, DELAY);
    });
}

export default (url: string) => {
    const routes: [RegExp, (...args: string[]) => Promise<Response>][] = [
        [ /\/tournaments\/(.+)/, tournamentHandler ],
        [ /\/tournaments(.*)/, tournamentsHandler ],
    ];

    for (let [route, handler] of routes) {
        const m = url.match(route);
        if (m) {
            return handler(...m);
        }
    }

    // no match, return 404
    return new Promise<Response>((resolve) => {
        resolve(response404);
    });
}
