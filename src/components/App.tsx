import React from "react";
import { useRoutes } from "hookrouter";

import Index from "./Index";
import Tournaments from "./Tournaments";
import Tournament from "./Tournament";
import GameContainer from "./GameContainer";

const routes = {
    "/": () => <Index />,
    "/tournaments": () => <Tournaments />,
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
