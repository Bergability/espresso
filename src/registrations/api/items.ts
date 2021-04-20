import espresso from '../../core/espresso';
import { ActionSet, Folder, Item, ItemType } from '@typings/items';
import { v4 as uuid } from 'uuid';
import { APIError, GetFolderPayload, GetItemPayload, PostPutItemPayload } from '@typings/api';
import { getItemCrumbs } from './action-set';

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
        const parentId = req.query.parent || null;
        const items = espresso.store.get<Item[]>('items');
        const payload: GetItemPayload = {
            items,
            _status,
        };

        payload.items = items.filter((i) => i.parent === parentId);

        res.status(_status);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
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
                    actions: [],
                    triggers: [],
                } as ActionSet;

                break;

            case 'folder':
                item = {
                    id,
                    name,
                    parent: parent || null,
                    type,
                    color: '#ff00ff',
                } as Folder;
                break;
        }

        espresso.store.set('items', [...items, item]);

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

espresso.server.register({
    path: '/api/folder/:id',
    method: 'get',
    response: (req, res) => {
        const id = req.params.id === 'home' ? null : req.params.id;
        const items = espresso.store.get('items') as Item[];
        const filtered = items.filter((i) => i.parent === id);

        const payload: GetFolderPayload = {
            items: filtered,
            crumbs: getItemCrumbs(id),
        };

        res.status(200);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});
