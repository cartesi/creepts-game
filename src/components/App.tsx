import React from "react";
import { useRoutes } from "hookrouter";

import Index from "./Index";
import { TournamentsContainer } from "./TournamentsContainer";
import Tournament from "./Tournament";
import GameContainer from "./GameContainer";
import { TournamentPhase } from "../Tournament";

const routes = {
    "/": () => <Index />,
    "/play": () => <TournamentsContainer name="Play" me phase={TournamentPhase.commit} />,
    "/join": () => <TournamentsContainer name="Join Tournament" phase={TournamentPhase.commit} />,
    "/my": () => <TournamentsContainer name="My Tournaments" me />,
    "/tournaments/:id": ({id}) => <Tournament id={id} />
};

export const App = () => {
    
    // TODO: create <NotFoundPage />
    const match = useRoutes(routes);
    return (
        <div>
            {match}
            <GameContainer visible={match.type === Tournament} />
        </div>
    );
}
