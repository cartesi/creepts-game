import verify from '../verifier/offlineVerifier';
const tests = require('./tests.json');

tests.forEach(([ log, level, score ]) => {
    test(log, () => {
        expect(verify(require(level), require(log))).toBe(score);
    });
});
