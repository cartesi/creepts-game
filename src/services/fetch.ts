import allTournaments from "./tournaments.json";
import queryString from "query-string";
import { TournamentPhase, Tournament } from "../Tournament";

const DELAY = 300;

export default (url: string) => {

    const parsedUrl = queryString.parseUrl(url);
    const phaseFilter = (phase: TournamentPhase) => (t: any) => t.phase == phase;
    const meFilter = (me: boolean) => (t: Tournament) => true;

    let tournaments = allTournaments.results;
    if (parsedUrl.query.phase) {
        tournaments = tournaments.filter(phaseFilter(TournamentPhase[parsedUrl.query.phase as string]));
    }

    return new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
            const body = JSON.stringify({ ...allTournaments, results: tournaments});
            const response = new Response(body);
            resolve(response);
            // reject("Error fetching tournaments")
        }, DELAY);
    });
}
