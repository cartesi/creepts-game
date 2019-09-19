import React, { useEffect, useState } from "react";
import { GameManager } from "../GameManager";
import { navigate } from "hookrouter";
import { Dimmer, Loader, Grid } from "semantic-ui-react";
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

    const [mapSelected, setMapSelected] = useState(false);
    const service = useTournamentService(id);
    
    useEffect(() => {
        if (service.status === "loaded") {
            const tournament = service.payload;
            const { map } = tournament;

            // select the map of the tournament
            GameManager.mapSelected(maps.indexOf(map));

            // exit button return no home
            GameManager.events.on("exit", () => {
                navigate('/');
            });

            setMapSelected(true);
        }
    }, [service]);

    return (
        <div>
            {!mapSelected && 
            <div style={{ backgroundColor: "white", height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
                <Grid verticalAlign="middle">
                    <Dimmer active>
                        <Loader size='massive'>Loading</Loader>
                    </Dimmer>
                </Grid>
            </div>
            }
        </div>
    );
}
