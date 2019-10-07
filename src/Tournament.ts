import { GameData, LevelObject, LogsObject, MapObject } from "../types/tower-defense";

export enum TournamentPhase {
    commit = "commit",
    reveal = "reveal",
    round = "round",
    end = "end"
}

export type TournamentScore = {
    score?: number,
    waves?: number,
    log?: LogsObject
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
