import fs from 'fs';
import verifier from './offlineVerifier';

const logsFile = fs.readFileSync(process.argv[2]);
const levelFile = fs.readFileSync(process.argv[3]);

const logs = JSON.parse(logsFile);
const level = JSON.parse(levelFile);

verifier(level, logs);
