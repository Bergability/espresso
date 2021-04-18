import espresso from '../../core/espresso';
import { ActionSet, Folder, Item, ItemType } from '@typings/items';
import { v4 as uuid } from 'uuid';
import { APIError, GetItemPayload, PostPutItemPayload } from '@typings/api';

/**
 *
 * Items
 *
 */
espresso.server.register({
    path: '/api/items',
    method: 'get',
    response: (req, res) => {
        let _status: number = 200;
        const parentId = req.query.parent;
        const items = espresso.store.get<Item[]>('items');
        const payload: GetItemPayload = {
            items,
            _status,
        };

        if (parentId) {
            payload.items = items.filter((i) => i.parent === parentId);
            return;
        }

        res.status(_status);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
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
        let _status: number = 200;

        const items = espresso.store.get('items') as Item[];

        let item: Item;

        switch (type as ItemType) {
            case 'action-set':
                item = {
                    id,
                    type,
                    name,
                    parent: parent || null,
                    cooldown: -1,
                    active: false,
                    settings: [],
                    triggers: [],
                } as ActionSet;

                espresso.store.set('items', [...items, item]);
                break;

            case 'folder':
                item = {
                    id,
                    name,
                    type,
                    color: '#ff00ff',
                } as Folder;
                break;
        }

        const payload: PostPutItemPayload = {
            item,
            _status,
        };

        res.status(200);
        res.json(payload);
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'put',
    response: (req, res) => {
        const { id } = req.params;
        const items = espresso.store.get('items') as Item[];
        const index = items.findIndex((i) => i.id === id);
        let _status: number = 200;
        let payload: PostPutItemPayload | APIError;

        if (index > -1) {
            const item = items[index];
            Object.entries(req.body).forEach(([key, value]) => {
                // @ts-ignore
                item[key] = value;
            });

            espresso.store.set(`items.${index}`, item);
            payload = {
                item,
                _status,
            };

            return;
        } else {
            payload = {
                _status,
                error: `No item with ID "${id}" found.`,
            };
        }

        res.contentType('application/json');
        res.status(_status);
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'delete',
    response: (req, res) => {
        const { id } = req.params;
        const payload = {
            id,
            message: 'TODO make this work',
        };
        res.send(JSON.stringify(payload, null, 4));
    },
});
