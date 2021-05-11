import { v4 as uuid } from 'uuid';
import { NewActionRequestPayload, PostActionPayload, APIError, GetActionPayload } from '@typings/api';
import { ActionSet, Item } from '@typings/items';
import { Action, Variable } from '@typings/espresso';
import espresso from '../../core/espresso';

import { getActionCrumbs } from './action-set';

const getVariables = (setId: string): Variable[] => {
    const triggers = espresso.triggers.getAll();
    const items = espresso.store.get('items') as Item[];
    const set = items.find((i) => i.id === setId) as ActionSet;

    if (!set) return [];

    return set.triggers.reduce<Variable[]>((acc, triggerSlug) => {
        const trigger = triggers.find((t) => t.slug === triggerSlug);
        if (!trigger) return acc;
        if (!trigger.variables) return acc;

        if (typeof trigger.variables === 'function') {
            const settings = set.settings.find((s) => s.for === triggerSlug);
            if (!settings) return acc;
            return [...acc, ...trigger.variables(settings)];
        }

        return [...acc, ...trigger.variables];
    }, []);
};

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
    path: '/api/actions/:id',
    method: 'get',
    response: (req, res) => {
        const { id } = req.params;
        const actions = espresso.store.get('actions') as Action[];
        const action = actions.find((a) => a.id === id);
        let payload: GetActionPayload | APIError;
        let _status: number = 404;

        if (action) {
            const schema = espresso.actions.find((s) => s.slug === action.slug);

            if (schema) {
                _status = 200;
                payload = {
                    action,
                    schema,
                    crumbs: getActionCrumbs(action.set, id),
                    variables: getVariables(action.set),
                };
            } else {
                payload = {
                    _status,
                    error: `Action schema with the slug of "${action.slug}" not found.`,
                };
            }
        } else {
            payload = {
                _status,
                error: `Action with the ID of "${id}" not found.`,
            };
        }

        res.status(_status);
        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/actions',
    method: 'post',
    response: (req, res) => {
        const body = req.body as NewActionRequestPayload;

        const schema = espresso.actions.find((s) => s.slug === body.slug);

        if (!schema) {
            res.status(500).send({});
            return;
        }

        const settings = espresso.actions.generateDefaults(body.slug);
        const id = uuid();
        const action: Action = {
            id,
            settings,
            version: schema.version,
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

espresso.server.register({
    path: '/api/actions/:id/move',
    method: 'put',
    response: (req, res) => {
        const id = req.params.id as string;
        const index = parseFloat(req.query.index as string);

        const actions = espresso.store.get('actions') as Action[];
        const items = espresso.store.get('items') as Item[];
        const parentActionIndex = actions.findIndex((a) => a.actions.includes(id));

        const move = (actionIds: string[]): string[] => {
            const currentIndex = actionIds.findIndex((i) => i === id);
            if (currentIndex > -1) {
                actionIds = actionIds.filter((aId) => aId !== id);
                actionIds.splice(index, 0, id);
            }
            return actionIds;
        };

        // Check if this action is a child of another action
        if (parentActionIndex > -1) {
            const parentAction = actions[parentActionIndex];
            espresso.store.set(`actions.${parentActionIndex}.actions`, move(parentAction.actions));
        }
        // else it is the child of the main Item
        else {
            const parentItemIndex = items.findIndex((i) => i.type === 'action-set' && i.actions.includes(id));
            if (parentItemIndex > -1) {
                const parentItem = items[parentItemIndex] as ActionSet;
                espresso.store.set(`items.${parentItemIndex}.actions`, move(parentItem.actions));
            }
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
