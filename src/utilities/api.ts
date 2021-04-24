// Types
import { APIError } from '@typings/api';

class EspressoAPI {
    private port: number;
    private url: string;

    constructor() {
        // TODO get this dynamically from the ipcRenderer
        this.port = 23167;
        this.url = `http://localhost:${this.port}/api`;
    }

    public fetch<T>(path: string, method: 'get' | 'post' | 'put' | 'delete', body?: BodyInit): Promise<T> {
        return new Promise((resolve, reject) => {
            fetch(`${this.url}${path}`, {
                method,
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    res.json()
                        .then((json) => {
                            // Status GOOD
                            if (res.status >= 200 && res.status < 300) {
                                resolve(json as T);
                            }
                            reject(json as APIError);
                        })
                        .catch((e) => {
                            console.log(e);
                            reject(e);
                        });
                })
                .catch((e) => {
                    console.log(e);
                    reject(e);
                });
        });
    }
}

const api = new EspressoAPI();

export default api;
