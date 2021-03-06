// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { LogsObject } from "@cartesi/creepts-engine";

export enum TournamentPhase {
    commit = "commit",
    reveal = "reveal",
    round = "round",
    end = "end"
}

export type TournamentScore = {
    score?: number,
    waves?: number,
    log?: LogsObject,
    progress?: number
}

interface Dictionary<T> {
    [key: string]: T;
}

export type Tournament = {
    id: string,
    name: string,
    map: string,
    playerCount: number,
    phase: TournamentPhase,
    deadline: Date,
    totalRounds?: number,
    currentRound?: number,
    lastRound?: number,
    currentOpponent?: string,
    winner?: string,
    scores?: Dictionary<TournamentScore>
}
