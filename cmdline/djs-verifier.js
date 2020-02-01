// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import verifier from './verifier';

var logger = new Duktape.Logger();

// scriptArgs does not have djs in the beggining, but program.parse expect it
// because it was designed for node, which includes node as process.argv[0]
// so let's add it so program.parse works
scriptArgs.unshift('./djs');
verifier(scriptArgs, readFile, print, function (info) { logger.info(JSON.stringify(info)); });
