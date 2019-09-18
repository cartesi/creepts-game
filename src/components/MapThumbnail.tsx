import React from "react";
import maps from "../../assets/config/maps.json";

export interface MapThumbnailProps { map: string, width: number, height: number };

export const MapThumbnail: React.SFC<MapThumbnailProps> = (props) => {

    const mapNames = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth"
    ];
    
    // get the map from the map definition file
    const mapId = mapNames.indexOf(props.map);

    // if map is undefined, we draw an empty canvas
    const emptyMap = {
        name: "Empty",
        size: { r: 15, c: 10 },
        path: [],
        plateaus: []
    };

    const map = mapId === -1 ? emptyMap : (maps[mapId] || emptyMap);

    // cell width and height
    const cw = props.width / map.size.c;
    const ch = props.height / map.size.r;

    // tile builder, a svg <rect> with a fill color
    const tile = (color: string) => ({c, r}, k: number) => {
        if (c < 0 || r < 0 || c >= map.size.c || r >= map.size.r) return <div key={k} />;
        return <rect x={c * cw} y={r * ch} width={cw} height={ch} fill={color} key={k} />
    };

    // path and plateus as a list of <rect>
    const path = Array.from(map.path, tile("#555"));
    const plateaus = Array.from(map.plateaus, tile("white"));

    // maps have different sizes
    // so I draw the path and plateus, and then centralize that
    const maxC = Math.max(...Array.from(maps, (map) => map.size.c));
    const maxR = Math.max(...Array.from(maps, (map) => map.size.r));
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
            <rect width="100%" height="100%" fill={"#ccc"} />
            <g transform={`scale(${sx}, ${sy})`}>
                <g transform={`translate(${dx}, ${dy})`}>
                    <rect width="100%" height="100%" fill={map.plateaus.length > 0 ? "#ccc" : "#fff"} key="-1" />
                    {path}
                    {plateaus} 
                </g>
            </g>            
            <rect width="100%" height="100%" stroke="black" fillOpacity={0} />
        </svg>
    );
}
