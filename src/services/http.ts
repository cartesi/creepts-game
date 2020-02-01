// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


interface IHttpResponse<T> extends Response {
    parsedBody?: T;
}

const defaultHeaders = new Headers();
defaultHeaders.append('Content-Type', 'application/json');

export const http = <T>(request: RequestInfo): Promise<IHttpResponse<T>> => {
    return new Promise((resolve, reject) => {
        let response: IHttpResponse<T>;
        fetch(request)
            .then(res => {
                response = res;
                return res.json()
            })
            .then(body => {
                if (response.ok) {
                    response.parsedBody = body;
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const get = async <T>(
    path: string,
    args: RequestInit = { method: "get" }
    ): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args))
};

export const post = async<T>(
    path: string,
    body: any,
    args: RequestInit = { method: "post", body: JSON.stringify(body), headers: defaultHeaders}
    ): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}

export const put = async<T>(
    path: string,
    body: any,
    args: RequestInit = { method: "put", body: JSON.stringify(body), headers: defaultHeaders}
    ): Promise<IHttpResponse<T>> => {
    return await http<T>(new Request(path, args));
}
