// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import React from "react";
import { loadMap } from "@cartesi/creepts-mappack";
import { MapObject } from "@cartesi/creepts-engine";

export interface MapThumbnailProps { map: string, width: number, height: number };

export const MapThumbnail: React.SFC<MapThumbnailProps> = (props) => {

    // if map is undefined, we draw an empty canvas
    const emptyMap: MapObject = {
        name: "Empty",
        size: { r: 15, c: 10 },
        path: [],
        plateaus: []
    };

    const map = loadMap(props.map) || emptyMap;

    // cell width and height
    const cw = props.width / map.size.c;
    const ch = props.height / map.size.r;

    // tile builder, a svg <rect> with a fill color
    const tile = (color: string) => ({c, r}, k: number) => {
        if (c < 0 || r < 0 || c >= map.size.c || r >= map.size.r) return <div key={k} />;
        return <rect x={c * cw} y={r * ch} width={cw} height={ch} fill={color} key={k} />
    };

    // path and plateus as a list of <rect>
    const path = Array.from(map.path, tile("#000018"));
    const plateaus = Array.from(map.plateaus, tile("#008abe"));

    // maps have different sizes
    // so I draw the path and plateus, and then centralize that
    // const maxC = Math.max(...Array.from(maps, (map) => map.size.c));
    // const maxR = Math.max(...Array.from(maps, (map) => map.size.r));
    const maxC = 12;
    const maxR = 15;
    const sx = map.size.c / maxC;
    const sy = map.size.r / maxR;
    const dx = ((maxC - map.size.c) / 2) * cw;
    const dy = ((maxR - map.size.r) / 2) * ch;

    // draw the SVG
    return (
        <svg
            version="1.1"
            baseProfile="full"
            className={"ui right floated"}
            width={props.width}
            height={props.height}
            xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill={"#002959"} />
            <g transform={`scale(${sx}, ${sy})`}>
                <g transform={`translate(${dx}, ${dy})`}>
                    <rect width="100%" height="100%" fill={map.plateaus.length > 0 ? "#002959" : "#008abe"} key="-1" />
                    {path}
                    {plateaus} 
                </g>
            </g>            
            <rect width="100%" height="100%" stroke="black" fillOpacity={0} />
        </svg>
    );
}
