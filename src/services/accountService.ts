// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import { useEffect, useState } from "react";
import { Service } from "./service";
import { get } from "./http";
import { apiUrl } from './config';

export interface Account {
    address: string;
    balance: number;
}

export const getAccount = () => {
    const url = `${apiUrl}/me`;
    return get<Account>(url);
}

export const useAccountService = () => {
    const [result, setResult] = useState<Service<Account>>({
        status: "loading"
    });

    useEffect(() => {
        getAccount()
            .then(response => setResult({ status: "loaded", payload: response.parsedBody }))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
};
