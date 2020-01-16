import engine from '../cmdline/engine';
import buildLevel from '../cmdline/level';
import maps from '../assets/config/maps.json';

const tests = require('./tests.json');

tests.forEach(([ log, mapIndex, score ]) => {
    test(log, () => {
        const map = maps[mapIndex];
        const level = buildLevel(map);
        expect(engine(level, require(log))).toBe(score);
    });
});
