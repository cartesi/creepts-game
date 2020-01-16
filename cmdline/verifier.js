import engine from './engine';

export default function (args, readFile, stdout, progress) {
    const logsFile = readFile(args[2]);
    const levelFile = readFile(args[3]);
    
    const logs = JSON.parse(logsFile);
    const level = JSON.parse(levelFile);

    progress = (args.indexOf('--debug') >= 0 || args.indexOf('-d') >= 0) ? progress : undefined;
    
    try {
        const score = engine(level, logs, progress);
        
        // Output score
        stdout(score + "\t");
    
    } catch (e) {
    
        // Output score
        stdout(0 + "\t" + e.message);
    
        // Exit program with failure
        throw e;
    }
};
