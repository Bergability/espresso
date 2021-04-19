import { v4 as uuid } from 'uuid';
import { NewActionRequestPayload, PostActionPayload } from '@typings/api';
import { ActionSet, Item } from '@typings/items';
import { Action } from '@typings/espresso';
import espresso from '../../core/espresso';

espresso.server.register({
    path: '/api/actions',
    method: 'get',
    response: (req, res) => {
        const { set } = req.query;
        const actions: Action[] = espresso.store.get('actions');
        const payload = actions.filter((a) => a.set === set);

        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/actions',
    method: 'post',
    response: (req, res) => {
        const body = req.body as NewActionRequestPayload;
        const settings = espresso.actions.generateDefaults(body.slug);
        const id = uuid();
        const action: Action = {
            id,
            settings,
            set: body.set,
            slug: body.slug,
            actions: [],
        };

        // Add the new action to the store
        espresso.store.set('actions', [...(espresso.store.get('actions') as string[]), action]);

        // If this action should be added to another action
        if (body.actionId) {
            const actionIndex = (espresso.store.get('actions') as Action[]).findIndex((a) => a.id === body.actionId);
            if (actionIndex > -1) {
                const actions = espresso.store.get(`actions.${actionIndex}.actions`) as string[];
                espresso.store.set(`actions.${actionIndex}.actions`, [...actions, id]);
            }
        } else {
            // Else add to the main item
            const itemIndex = (espresso.store.get('items') as Item[]).findIndex((i) => i.id === body.set);
            if (itemIndex > -1) {
                const actions = espresso.store.get(`items.${itemIndex}.actions`) as string[];
                espresso.store.set(`items.${itemIndex}.actions`, [...actions, id]);
            }
        }

        const payload: PostActionPayload = { id, action };

        res.status(200);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/actions/:id',
    method: 'put',
    response: (req, res) => {
        const { id } = req.params;
        const action = req.body as Action;

        const actions = espresso.store.get('actions') as Action[];

        const index = actions.findIndex((a) => a.id === id);

        if (index > -1) {
            espresso.store.set(`actions.${index}`, action);
        }

        res.contentType('application/json');
        res.send(JSON.stringify({}, null, 4));
    },
});

const deleteAction = (actionId: string) => {
    const actions = espresso.store.get('actions') as Action[];
    const items = espresso.store.get('items') as Item[];

    const index = actions.findIndex((a) => a.id === actionId);

    if (index > -1) {
        const action = actions[index];

        // Remove the action from the main set's action list
        const setIndex = items.findIndex((i) => i.id === action.set);
        if (setIndex > -1) {
            const set = items[setIndex] as ActionSet;
            set.actions = set.actions.filter((i) => i !== actionId);
            espresso.store.set(`items.${setIndex}`, set);
        }

        // Remove any references of it from child actions
        actions.forEach((a, i) => {
            if (a.actions && a.actions.includes(actionId)) {
                a.actions = a.actions.filter((i) => i !== actionId);
                espresso.store.set(`actions.${i}`, a);
            }
        });

        // Finally, remove the action
        espresso.store.set(
            'actions',
            actions.filter((a) => a.id !== actionId)
        );

        // Remove any children
        action.actions.forEach((a) => {
            deleteAction(a);
        });
    } else {
        // Could not find
    }
};

espresso.server.register({
    path: '/api/actions/:id',
    method: 'delete',
    response: (req, res) => {
        const { id } = req.params;
        deleteAction(id);

        res.contentType('application/json');
        res.send(JSON.stringify({}, null, 4));
    },
});
