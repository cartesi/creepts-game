import verifier from './verifier';

var logger = new Duktape.Logger();

// scriptArgs does not have djs in the beggining, but program.parse expect it
// because it was designed for node, which includes node as process.argv[0]
// so let's add it so program.parse works
scriptArgs.unshift('./djs');
verifier(scriptArgs, readFile, console.log, function (info) { logger.info(JSON.stringify(info)); });
