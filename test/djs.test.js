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
