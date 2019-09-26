import React, { useEffect, useState } from "react";
import { GameManager } from "../GameManager";
import { navigate } from "hookrouter";
import { Dimmer, Loader, Grid, Message, Button } from "semantic-ui-react";
import { useTournamentService } from "../services/tournamentService";
import { putScore } from "../services/scoreService";

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

    // this will control a loading screen
    const [mapLoaded, setMapLoaded] = useState(false);

    // error message after submitting a score
    const [submitError, setSubmitError] = useState<string>(null);

    // load the tournament from the backend
    const service = useTournamentService(id);

    useEffect(() => {
        if (service.status === "loaded") {
            const tournament = service.payload;
            const { map } = tournament;

            // select the map of the tournament
            GameManager.mapSelected(maps.indexOf(map));

            // this will remove the loading screen
            setMapLoaded(true);
        }
    }, [service.status]);

    const gameOverHandler = (level: LevelObject, log: LogsObject, score: number, waves: number) => {
        putScore(id, { score, waves, log })
            .then(response => {
                setSubmitError(response.ok ? null : response.statusText);
            })
            .catch(error => {
                setSubmitError(error.message);
            });
    };

    const exitHandler = () => {
        navigate('/');
    }

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        GameManager.events.on("gameOver", gameOverHandler);
        GameManager.events.on("exit", exitHandler)
        return () => {
            GameManager.events.removeListener("gameOver", gameOverHandler);
            GameManager.events.removeListener("exit", exitHandler);
        }
    }, []);

    return (
        // mapLoaded controls the visibility of a loading screen on top of the game
        // which goes aways once the map changes
        <div>
            {!mapLoaded && 
            <div style={{ backgroundColor: "white", height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
                <Grid verticalAlign="middle">
                    <Dimmer active>
                        <Loader size='massive'>Loading</Loader>
                    </Dimmer>
                </Grid>
            </div>
            }

            {submitError &&
            <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
                <Grid verticalAlign="middle">
                    <Dimmer active>
                        <Message negative>
                            <Message.Header>Error submitting score</Message.Header>
                            <p>{submitError}</p>
                            <Button negative fluid onClick={ () => navigate('/') }>Exit</Button>
                        </Message>
                    </Dimmer>
                </Grid>
            </div>
            }
        </div>
    );
}
