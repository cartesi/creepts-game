import verify from '../cmdline/verifier';
import buildLevel from '../cmdline/level';
import maps from '../assets/config/maps.json';

const tests = require('./tests.json');

tests.forEach(([ log, mapIndex, score ]) => {
    test(log, () => {
        const map = maps[mapIndex];
        const level = buildLevel(map);
        expect(verify(level, require(log))).toBe(score);
    });
});
