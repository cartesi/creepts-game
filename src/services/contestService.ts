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
import { get, post } from "./http";
import { contestUrl } from './config';
import { LogsObject } from "@cartesi/creepts-engine";

export interface Contest {
    id: string;
    name: string;
    contestantLabel: string;
    map: string;
    logo?: string;
    startDate?: string;
    deadline?: string;
}

const getContests = () => {
    const url = `${contestUrl}`;
    return get<Contest[]>(url);
};

export const getContest = (id: string) => {
    const url = `${contestUrl}/${id}`;
    return get<Contest>(url);
};

export const submitContestEntry = (contestId: string, contestantId: string, score: number, waves: number, log: LogsObject) => {
    const url = `${contestUrl}/${contestId}/${contestantId}`;
    return post(url, { score, waves, log });
};

export const useContestService = (id: string) => {
    const [result, setResult] = useState<Service<Contest>>({
        status: "loading"
    });

    useEffect(() => {
        getContest(id)
            .then(response => setResult({ status: "loaded", payload: response.parsedBody }))
            .catch(error => setResult({ status: "error", error }));
    }, [id]);

    return result;
};

export const useContestsService = () => {
    const [result, setResult] = useState<Service<Contest[]>>({
        status: "loading"
    });

    useEffect(() => {
        getContests()
            .then(response => setResult({ status: "loaded", payload: response.parsedBody }))
            .catch(error => setResult({ status: "error", error }));
    }, []);

    return result;
}
