
export enum TournamentPhase {
    commit,
    reveal,
    round,
    end
}

export class Tournament {
    public id: string;
    public name: string;
    public map: string;
    public playerCount: number;
    public phase: TournamentPhase;
    public deadline: Date;
    public totalRounds?: number;
    public currentRound?: number;
    public lastRound?: number;
    public currentOpponent?: string;
    public winner?: string;
}

export class TournamentScore {
    public id: string;
    public score: number;
    public log?: LogsObject
}
