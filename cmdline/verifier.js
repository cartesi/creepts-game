import engine from './engine';

export default function (args, readFile, writer) {
    const logsFile = readFile(args[2]);
    const levelFile = readFile(args[3]);
    
    const logs = JSON.parse(logsFile);
    const level = JSON.parse(levelFile);

    const progress = (args.indexOf('--debug') >= 0 || args.indexOf('-d') >= 0) ? writer : undefined;
    
    try {
        const score = engine(level, logs, progress);
        
        // Output score
        writer(score + "\t");
    
    } catch (e) {
    
        // Output score
        writer(0 + "\t" + e.message);
    
        // Exit program with failure
        throw e;
    }
};
