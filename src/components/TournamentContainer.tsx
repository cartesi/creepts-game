import React, { useEffect } from "react";
import { GameManager } from "../GameManager";
import { navigate } from "hookrouter";
import { useTournamentService } from "../services/useTournamentsService";

interface IProps { id: string }

export const TournamentContainer: React.FC<IProps> = ({ id }) => {

    const maps = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    const service = useTournamentService(id);
    useEffect(() => {
        if (service.status === "loaded") {
            const tournament = service.payload;
            const { map } = tournament;

            // select the map of the tournament
            console.log("Selecting map", map);
            GameManager.mapSelected(maps.indexOf(map));

            // exit button return no home
            GameManager.events.on("exit", () => {
                navigate('/');
            });
        }
    }, [service]);

    return <div />;
}
