const exec = require("child_process").exec;
const tests = require('./tests.json');

const djs = "verifier/djs dist/djs-verifier-bundle.js";
const timeout = 1000 * 60 * 10; // 10 minutes

tests.forEach(([ log, level, score ]) => {
    test(log, done => {
        exec(`${djs} ./test/${log} ./test/${level}`, (error, stdout, stderr) => {
            expect(error).toBeFalsy();
            expect(parseInt(stdout)).toBe(score);
            done();
        });
    }, timeout);
});
