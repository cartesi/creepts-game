import allTournaments from "./tournaments.json";
import queryString from "query-string";
import { TournamentPhase, Tournament } from "../Tournament";

// artificial delay, for testing purposes
const DELAY = 300;

export default (url: string) => {

    // TODO: move this
    const address = "0x036f5cf5ca56c6b5650c9de2a41d94a3fe1e2077";

    const parsedUrl = queryString.parseUrl(url);
    const phaseFilter = (phase: TournamentPhase) => (t: any) => t.phase == phase;
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
            // reject("Error fetching tournaments")
        }, DELAY);
    });
}
