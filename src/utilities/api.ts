class EspressoAPI {
    private port: number;
    private url: string;

    constructor() {
        // TODO get this dynamically from the ipcRenderer
        this.port = 23167;
        this.url = `http://localhost:${this.port}/api`;
    }

    public async get<ReturnType>(url: string, body?: BodyInit) {
        try {
            const res = await fetch(`${this.url}${url}`, {
                method: 'get',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await res.json();
            return json as ReturnType;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public async post<ReturnType>(url: string, body?: BodyInit) {
        try {
            const res = await fetch(`${this.url}${url}`, {
                method: 'post',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await res.json();
            return json as ReturnType;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public async put<ReturnType>(url: string, body?: BodyInit) {
        try {
            const res = await fetch(`${this.url}${url}`, {
                method: 'put',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await res.json();
            return json as ReturnType;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

const api = new EspressoAPI();

export default api;
