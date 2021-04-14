import ws from 'ws';
import http from 'http';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

import EspressoRegistrar from './registrar';

interface ServerRoute {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'head';
    response: (req: Request, res: Response) => void;
    description?: string;
    category?: string;
}

export default class EspressoServer extends EspressoRegistrar<ServerRoute> {
    private app = express();
    private server = http.createServer(this.app);
    private socket = new ws.Server({ server: this.server });

    constructor() {
        super({
            registeredEvent: 'server-route-registered',
        });

        setInterval(() => {
            this.emitToSocket('ping');
        }, 30000);

        this.app.use(bodyParser.json());

        this.server.listen(23167);
    }

    public emitToSocket(event: string, data?: any) {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({ event, data }));
        });
    }

    protected preRegister = (route: ServerRoute) => {
        // If a route already has this path do not register route.
        return this.find((r) => r.path === route.path && r.method === route.method) ? false : true;
    };

    protected postRegister = (routeId: string) => {
        // Register the route with Express
        const route = this.getById(routeId);
        if (!route) return;
        this.app[route.method.toLowerCase() as ServerRoute['method']](route.path, route.response);
    };
}

// const app = Express();

// app.get('/', function (req, res) {
//     res.send('Hello World');
// });

// app.listen(23167);
