import fs from 'fs';
import verifier from './verifier';

verifier(process.argv, fs.readFileSync, console.log);
