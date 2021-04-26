import espresso from '../../core/espresso';
import { ActionSet, Folder, Item, List, ItemType } from '@typings/items';
import { v4 as uuid } from 'uuid';
import { APIError, GetFolderPayload, GetItemPayload, GetItemsPayload, PostPutItemPayload } from '@typings/api';
import { getItemCrumbs } from './action-set';
import { Action } from '@typings/espresso';

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
        const payload: GetItemsPayload = {
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
        const { type, name, parent, managed, message } = req.body;
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
                };

                break;

            case 'folder':
                item = {
                    id,
                    name,
                    parent: parent || null,
                    type,
                    color: '#ffffff',
                };
                break;

            case 'list':
                item = {
                    id,
                    name,
                    parent: parent || null,
                    type,
                    items: [],
                };

                if (managed) item.managed === managed;
                if (message) item.message = message;
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

        let payload: GetItemPayload | APIError;

        if (item) {
            const crumbs = getItemCrumbs(item.id);

            payload = {
                item,
                crumbs: crumbs,
            };
        } else {
            payload = {
                _status: 404,
                error: 'No item found with specified',
            };
        }

        res.status(200);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
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
        const items = espresso.store.get('items') as Item[];
        const actions = espresso.store.get('actions') as Action[];

        const getChildren = (parentId: string): string[] => {
            const item = items.find((i) => i.id === parentId);

            if (!item) return [];

            const children = items.reduce<string[]>((acc, i) => {
                if (i.parent === parentId) {
                    if (i.type === 'folder') {
                        return [...acc, i.id, ...getChildren(i.id)];
                    }
                    return [...acc, i.id];
                }
                return acc;
            }, []);
            return children;
        };

        let toDelete = [id];

        const item = items.find((i) => i.id === id);

        if (item) {
            if (item.type === 'folder') {
                toDelete = [...toDelete, ...getChildren(id)];
            }
        }

        const newItems = items.filter((i) => !toDelete.includes(i.id));
        const newActions = actions.filter((a) => !toDelete.includes(a.set));

        espresso.store.set('items', newItems);
        espresso.store.set('actions', newActions);
        res.send(JSON.stringify({}, null, 4));
    },
});

espresso.server.register({
    path: '/api/folder/:id',
    method: 'get',
    response: (req, res) => {
        const id = req.params.id === 'home' ? null : req.params.id;
        const items = espresso.store.get('items') as Item[];
        const filtered = items.filter((i) => i.parent === id);

        const folder = items.find((i) => i.id === id && i.type === 'folder') as Folder | undefined;

        const payload: GetFolderPayload = {
            folder: folder || { name: 'Home', color: '', parent: null, id: '', type: 'folder' },
            items: filtered,
            crumbs: getItemCrumbs(id),
        };

        res.status(200);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});
