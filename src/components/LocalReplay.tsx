// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { FullScreenMessage } from "./FullScreenMessage";
import { navigate } from "hookrouter";
import { GameManager } from "../GameManager";
import { loadLevel, loadMap } from "@cartesi/creepts-mappack";
import { Backdrop, Select, MenuItem, FormControl, InputLabel, Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from "material-ui-dropzone";

interface IProps { };

const useStyles = makeStyles(theme => ({
    dropzone: {
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));
  
export const LocalReplay: React.FC<IProps> = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>(undefined);
    const [loaded, setLoaded] = useState(false);
    const classes = useStyles();

    const [mapName, setMapName] = useState<string>(undefined);

    const load = (file: Blob) => {
        try {
            setError(undefined);
            setLoading(true);

            const fileReader = new FileReader();
            fileReader.onloadend = (e) => {
                const content = fileReader.result;

                try {
                    // log from file
                    const log = JSON.parse(content.toString());

                    // load map
                    const map = loadMap(mapName);

                    // build level object from map
                    const level = loadLevel(map);

                    setLoading(false);
                    setError(undefined);
                    setLoaded(true);

                    // open game log replay screen
                    GameManager.enterLogScene(log, level);
                } catch (e) {
                    setLoading(false);
                    setError(e);
                }
            };
            fileReader.readAsText(file);

        } catch (e) {
            setLoading(false);
            setError(e);
        }
    };

    // register gameOver and exit event handlers on mount, and removes them on unmount
    useEffect(() => {
        const exitHandler = () => navigate('/');
        GameManager.events.on("exit", exitHandler);
        return () => GameManager.events.removeListener("exit", exitHandler);
    }, []);
    
    const maps = [
        "original",
        "waiting_line",
        "turn_round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    return (
        <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1 }}>
            {loading && <Loading />}
            {error &&
                <FullScreenMessage
                    title="Error Loading Log"
                    message={error.message}
                    buttonTitle="Exit"
                    onClick={() => navigate('/')} />
            }
            <Backdrop open={!loaded}>
                <Paper>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="map-select-label">Map</InputLabel>
                        <Select
                            labelId="map-select-label"
                            id="map-select"
                            value={mapName}
                            displayEmpty
                            className={classes.selectEmpty}
                            onChange={e => setMapName(e.target.value.toString())}>
                            {maps.map(mapName => <MenuItem key={mapName} value={mapName}>{mapName}</MenuItem>)}
                        </Select>
                        {mapName && <DropzoneArea
                            dropzoneClass={classes.dropzone}
                            dropzoneText="Drag and drop or select a JSON Log File"
                            acceptedFiles={[ 'application/json' ]}
                            filesLimit={1}
                            showAlerts={false}
                            onChange={e => load(e[0])}
                        />}
                    </FormControl>
                </Paper>
            </Backdrop>
        </div>
    );
};
