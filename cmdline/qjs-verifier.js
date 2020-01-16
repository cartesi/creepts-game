import verifier from './verifier';

function readFile(n) {
	var f = std.open(n, "r");
	var s = f.readAsString();
	f.close();
	return s;
}

// scriptArgs does not have djs in the beggining, but program.parse expect it
// because it was designed for node, which includes node as process.argv[0]
// so let's add it so program.parse works
scriptArgs.unshift('./qjs');
verifier(scriptArgs, readFile, console.log, console.error);
