
import verifier from './offlineVerifier';

const logsFile = readFile(scriptArgs[1]);
const levelFile = readFile(scriptArgs[2]);

const logs = JSON.parse(logsFile);
const level = JSON.parse(levelFile);

verifier(level, logs);
