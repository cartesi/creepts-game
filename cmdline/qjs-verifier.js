
import verifier from './verifier';

function readFile(n) {
	var f = std.open(n, "r");
	var s = f.readAsString();
	f.close();
	return s;
}


const logsFile = readFile(scriptArgs[1]);
const levelFile = readFile(scriptArgs[2]);

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