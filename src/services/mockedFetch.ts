// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import allTournaments from "./tournaments.json";
import logShort from "./mock/log_short.json";
import queryString from "query-string";
import { TournamentPhase, Tournament } from "../Tournament";

// artificial delay, for testing purposes
const DELAY = 300;
const ACCOUNT_ADDRESS = "0x036f5cf5ca56c6b5650c9de2a41d94a3fe1e2077";
const response404 = new Response(null, { status: 404, statusText: "Not Found" });

const accountHandler = (_url: string) => {
    return new Promise<Response>((resolve, _reject) => {
        setTimeout(() => {
            // const balance = 0;
            // const balance = (100000000000000000000 - 534321);
            const balance = 10000000000000000;
            const body = JSON.stringify({ address: ACCOUNT_ADDRESS, balance });
            const response = new Response(body);
            resolve(response);
        }, DELAY);
    });
};

let globalProgress = 0;

const scoreHandler = (_url: string, id: string, player: string) => {
    return new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
            globalProgress += 10;
            if (globalProgress == 100) {
                globalProgress = 0;
                const body = JSON.stringify({ log: logShort });
                const response = new Response(body);
                resolve(response);
            } else {
                const body = JSON.stringify({ progress: globalProgress });
                const response = new Response(body, { status: 202 });
                resolve(response);
            }
        }, DELAY);
    });
}

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
        }, DELAY * 5);
    });
};

export default (request: RequestInfo) => {
    const url = (request as Request).url;
    console.log(url);
    const routes: [RegExp, (...args: string[]) => Promise<Response>][] = [
        [ /\/tournaments\/(.+)\/scores\/(.+)/, scoreHandler ],
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
