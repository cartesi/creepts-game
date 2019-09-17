
export enum TournamentPhase {
    commit,
    reveal,
    round,
    end
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
    winner?: string
}

export type TournamentScore = {
    score: number,
    waves: number,
    log?: LogsObject
}
