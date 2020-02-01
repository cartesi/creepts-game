// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


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
