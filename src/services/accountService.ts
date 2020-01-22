import { useEffect, useState } from "react";
import { Service } from "./service";
import { get } from "./http";
import { apiUrl } from './config';

export interface Account {
    account: string;
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
