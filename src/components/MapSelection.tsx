// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { MapThumbnail } from "./MapThumbnail";
import { loadMap } from "@cartesi/creepts-mappack";

interface IProps {
};

export const MapSelection: React.FC<IProps> = () => {

    // XXX: get list of maps from mappack
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
        <Grid container direction="column" spacing={4} alignItems="center">
            <Grid item><Typography variant="h3">Select Map</Typography></Grid>
            <Grid item container spacing={4} justify="center">
                {maps.map(mapName => {
                    const map = loadMap(mapName);
                    return (
                        <Grid item key={mapName}>
                            <a href={`/maps/${mapName}`}>
                                <MapThumbnail map={mapName} width={200} height={240} />
                            </a>
                            <p style={{ textAlign: "center" }}>{map.name}</p>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};
