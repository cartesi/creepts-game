// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import fs from 'fs';
import path from 'path';
import program from 'commander';

import buildLevel from './level';
import { MapObject, LevelObject } from "../types/tower-defense";

import maps from '../assets/config/maps.json';

const one = (mapIndex: number) => {
    // check if valid index
    if (mapIndex < 0 || mapIndex >= maps.length) {
        throw new Error(`invalid map index '${mapIndex}'`);
    }

    // get map using map index
    const map: MapObject = maps[mapIndex];

    // write level object as string
    console.log(JSON.stringify(buildLevel(map)));
};

const all = (outdir: string, numbered: boolean) => {
    const names = [
        "original",
        "waiting_line",
        "turn_round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ];

    const levels = maps.map(map => buildLevel(map));
    levels.forEach((level: LevelObject, index: number) => {
        const name = numbered ? index.toString() : names[index];
        const filename = path.resolve(outdir, `${name}.json`);
        fs.writeFileSync(filename, JSON.stringify(level));
    });
}

// parse command line
program.version('0.1.0');
program
    .option('-m, --map <index>', 'map index to generated to stdout', 0)
    .option('-d, --directory <path>', 'output directory of json files', './')
    .option('-n, --numbered', 'numbered files instead of named');
program.parse(process.argv);

if (program.map) {
    one(program.map)
} else {
    all(program.directory, program.numbered);
}
