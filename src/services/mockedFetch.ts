// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import allTournaments from "./tournaments.json";
import queryString from "query-string";
import { TournamentPhase, Tournament } from "../Tournament";

// artificial delay, for testing purposes
const DELAY = 300;
const ACCOUNT_ADDRESS = "0x036f5cf5ca56c6b5650c9de2a41d94a3fe1e2077";
const response404 = new Response(null, { status: 404, statusText: "Not Found" });

const accountHandler = (_url: string) => {
    return new Promise<Response>((resolve, _reject) => {
        setTimeout(() => {
            const body = JSON.stringify({ account: ACCOUNT_ADDRESS });
            const response = new Response(body);
            resolve(response);
        }, DELAY);
    });
};

const tournamentHandler = (_url: string, id: string) => {
    return new Promise<Response>((resolve, _reject) => {
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
};

const tournamentsHandler = (url: string) => {
    const parsedUrl = queryString.parseUrl(url);
    const phaseFilter = (phase: TournamentPhase) => (t: any) => {
        return t.phase == phase;
    }
    const meFilter = (me: boolean) => (t: any) => {
        const scores = t.scores || {};
        return me ? scores[ACCOUNT_ADDRESS] : !scores[ACCOUNT_ADDRESS];
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
};

export default (request: RequestInfo) => {
    const url = (request as Request).url;
    const routes: [RegExp, (...args: string[]) => Promise<Response>][] = [
        [ /\/tournaments\/(.+)/, tournamentHandler ],
        [ /\/tournaments(.*)/, tournamentsHandler ],
        [ /\/me/, accountHandler ],
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
};
