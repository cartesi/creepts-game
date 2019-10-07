import fs from 'fs';
import verifier from './offlineVerifier';

const logsFile = fs.readFileSync(process.argv[2]);
const levelFile = fs.readFileSync(process.argv[3]);

const logs = JSON.parse(logsFile);
const level = JSON.parse(levelFile);

try {
    const score = verifier(level, logs);
    
    // Output score
    console.log(score + "\t");

} catch (e) {

    // Output score
    console.log(0 + "\t" + e.message);

    // Exit program with failure
    throw e;
}
