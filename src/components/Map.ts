import mapData from "../../assets/config/maps.json";
import { MapObject } from "../../types/tower-defense";

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

export const getMapByIndex = (index: number): MapObject => {
    return mapData[index];
}

export const getMapByName = (name: string): MapObject => {
    const index = mapNames.indexOf(name);
    return (index >= 0) ? getMapByIndex(index) : null;
}
