import React, { useEffect } from "react";
import { Loading } from "./Loading";
import { FullScreenMessage } from "./FullScreenMessage";
import { useScoreService } from "../services/scoreService";
import { navigate } from "hookrouter";
import { GameManager } from "../GameManager";

import { GameConstants } from "../GameConstants";
import enemiesData from "../../assets/config/enemies.json";
import turretsData from "../../assets/config/turrets.json";
import wavesData from "../../assets/config/waves.json";
import { getMapByName } from "./Map";

interface ReplayProps { tournamentId: string, id: string };

/**
 * Build a LevelObject for a map
 * @param mapName name of the map of the tournament
 */
const levelForMap = (mapName: string): LevelObject => {
    const map = getMapByName(mapName);

    const gameConfig: Anuto.Types.GameConfig = {
        timeStep: GameConstants.TIME_STEP,
        runningInClientSide: true,
        enemySpawningDeltaTicks: GameConstants.ENEMY_SPAWNING_DELTA_TICKS,
        credits: GameConstants.INITIAL_CREDITS,
        lifes: GameConstants.INITIAL_LIFES,
        boardSize: map.size,
        enemiesPathCells : map.path,
        plateausCells: map.plateaus
    };

    return {
        engineVersion: Anuto.GameConstants.VERSION,
        gameConfig,
        enemiesData: enemiesData.enemies,
        turretsData: turretsData.turrets,
        wavesData: wavesData.waves
    }
}

export const Replay: React.FC<ReplayProps> = ({ tournamentId, id }) => {

    // get the score with log from server
    const service = useScoreService(tournamentId, id);

    useEffect(() => {
        if (service.status == "loaded") {
            // get map name from tournament
            const map = service.payload[0].map;

            // build level object from map
            const level = levelForMap(map);

            // log from server
            const log = service.payload[1].log;

            // open game log replay screen
            GameManager.enterLogScene(log, level);
        }

    }, [service.status]);

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        const exitHandler = () => navigate('/');    
        GameManager.events.on("exit", exitHandler);
        return () => GameManager.events.removeListener("exit", exitHandler);
    }, []);
    
    return (
        <div>
            {service.status == "loading" && <Loading />}
            {service.status == "error" &&
                <FullScreenMessage
                    title="Error Loading Log"
                    message={service.error.message}
                    buttonTitle="Exit"
                    onClick={() => navigate('/')} />
            }
        </div>
    );
}
