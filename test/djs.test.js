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
import buildLevel from '../cmdline/level';
import maps from '../assets/config/maps.json';

const exec = require("child_process").exec;
const tests = require('./tests.json');

const djs = "djs dist/djs-verifier-bundle.js";
const timeout = 1000 * 60 * 10; // 10 minutes

tests.forEach(([ log, mapIndex, score ]) => {
    test(log, done => {
        const map = maps[mapIndex];
        const level = buildLevel(map);
        const filename = path.resolve('./test', `${mapIndex}.json`);
        fs.writeFileSync(filename, JSON.stringify(level));

        exec(`${djs} ./test/${log} ${filename}`, (error, stdout, stderr) => {
            expect(error).toBeFalsy();
            expect(parseInt(stdout)).toBe(score);
            done();
        });
    }, timeout);
});
