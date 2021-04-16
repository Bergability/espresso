import espresso from '../core/espresso';
import { ActionSet, Item, ItemType } from '@typings/items';
import { v4 as uuid } from 'uuid';

espresso.server.register({
    method: 'get',
    path: '/',
    response: (req, res) => {
        const lines: string[] = [
            'Welcome to the Espresso server!',
            'Below is a list of all registered server routes. \n',
            '-------------------------------------------------\n',
        ];

        espresso.server.getAll().forEach((route) => {
            lines.push(`${route.method.toUpperCase()} - ${route.path}`);
        });

        res.type('text/plain');
        res.send(lines.join('\n'));
    },
});

espresso.server.register({
    path: '/api',
    method: 'get',
    response: (req, res) => {
        res.type('text/plain');
        res.send('Welcome to the Espresso API!');
    },
});

espresso.server.register({
    path: '/api/items',
    method: 'get',
    response: (req, res) => {
        const parentId = req.query.parent;

        res.contentType('application/json');

        if (parentId) {
            // @ts-ignore
            const items = espresso.store.get('items').filter((i) => i.parent === parentId);
            res.send(JSON.stringify(items, null, 4));
            return;
        }

        res.send(JSON.stringify(espresso.store.get('items'), null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'get',
    response: (req, res) => {
        const { id } = req.params;
        const items = espresso.store.get('items');
        // @ts-ignore
        const item = items.find((i) => i.id === id);

        if (item) {
            res.contentType('application/json');
            res.send(JSON.stringify(item, null, 4));
            return;
        }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});

espresso.server.register({
    path: '/api/items',
    method: 'post',
    response: (req, res) => {
        const { type, name, parent } = req.body;
        const id = uuid();

        const items = espresso.store.get('items');

        switch (type as ItemType) {
            case 'action-set':
                const item: ActionSet = {
                    id,
                    type,
                    name,
                    parent: parent || null,
                    cooldown: -1,
                    active: false,
                    settings: [],
                    triggers: [],
                };

                espresso.store.set('items', [...items, item]);
                res.json(item);
                break;
        }
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'put',
    response: (req, res) => {
        const { id } = req.params;
        const items = espresso.store.get('items') as any[];
        // @ts-ignore
        const index = items.findIndex((i) => i.id === id);

        if (index > -1) {
            const item = items[index];
            Object.entries(req.body).forEach(([key, value]) => {
                item[key] = value;
            });

            espresso.store.set(`items.${index}`, item);

            res.contentType('application/json');
            res.send(JSON.stringify(item, null, 4));
            return;
        }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id/run',
    method: 'post',
    response: (req, res) => {
        const { id } = req.params;
        //   const item = espresso.items.getById(id);

        //   if (item) {
        //     espresso.actions.runSet(id);
        //     res.contentType("application/json");
        //     res.send(
        //       JSON.stringify(
        //         {
        //           success: true
        //         },
        //         null,
        //         4
        //       )
        //     );
        //     return;
        //   }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});
