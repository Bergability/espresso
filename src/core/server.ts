// Libraries
import ws from 'ws';
import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';

// Base Class
import EspressoRegistrar from './registrar';

// Types
import { Request, Response } from 'express';

interface EspressoServerRoute {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    response: (req: Request, res: Response) => void;
    description?: string;
    category?: string;
}

export default class EspressoServer extends EspressoRegistrar<EspressoServerRoute> {
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
    }

    // Start the server if it is not already running
    public start(port: number = 23167) {
        if (this.server.listening) return;
        this.server.listen(port);
    }

    public emitToSocket(event: string, data?: any) {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({ event, data }));
        });
    }

    protected preRegister = (route: EspressoServerRoute) => {
        // If a route already has this path do not register route.
        return this.find((r) => r.path === route.path && r.method === route.method) ? false : true;
    };

    protected postRegister = (routeId: string) => {
        // Register the route with Express
        const route = this.getById(routeId);
        if (!route) return;
        this.app[route.method.toLowerCase() as EspressoServerRoute['method']](route.path, route.response);
    };
}
