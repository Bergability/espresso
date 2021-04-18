import espresso from '../../core/espresso';
import { Input } from '@typings/inputs';
import { ActionSet, ActionSetSetting, Item } from '@typings/items';
import { APIError, GetPutActionSetPayload, GetActionSetTriggerPayload, PutActionSetTriggerPayload } from '@typings/api';
// import { v4 as uuid } from 'uuid';

const generateDefaults = <Data>(inputs: Input<Data>[], data: Object = {}) => {
    inputs.forEach((input) => {
        if (input.type === 'button') return;

        // @ts-ignore
        if (data[input.key] === undefined) {
            // @ts-ignore
            data[input.key] = input.default;
        }
    });

    return data;
};

espresso.server.register({
    path: '/api/action-set/:id',
    method: 'get',
    response: (req, res) => {
        const { id } = req.params;
        let _status: number = 404;
        let payload: GetPutActionSetPayload | APIError;

        const set = espresso.store.get<Item[]>('items').find((i) => i.id === id);

        if (set) {
            if (set.type === 'action-set') {
                _status = 200;
                payload = {
                    set,
                    _status,
                    actions: [],
                };
            } else {
                payload = {
                    _status,
                    error: `The item with the ID "${id}" is of type "${set.type}", not "action-set".`,
                };
            }
        } else {
            payload = {
                _status,
                error: `No item with the ID "${id}" found.`,
            };
        }

        res.contentType('application/json');
        res.status(_status);
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/action-set/:id',
    method: 'put',
    response: (req, res) => {
        const { id } = req.params;
        let _status: number = 404;
        let payload: GetPutActionSetPayload | APIError;

        const items = espresso.store.get<Item[]>('items');
        const triggers = espresso.triggers.getAll();

        const setIndex = items.findIndex((i) => i.id === id);

        if (setIndex > -1) {
            const set = req.body as ActionSet;

            if (set.type === 'action-set') {
                // Remove any trigger settings that shouldn't be there
                set.settings = set.settings.filter((s) => set.triggers.includes(s.for));

                set.triggers.forEach((slug) => {
                    const setting = set.settings.find((s) => s.for === slug);
                    const trigger = triggers.find((t) => t.slug === slug);

                    if (!setting && trigger && trigger.settings) {
                        set.settings.push({
                            for: slug,
                            ...generateDefaults(trigger.settings),
                        });
                    }
                });

                espresso.store.set(`items.${setIndex}`, set);
                _status = 200;
                payload = {
                    _status,
                    set,
                    actions: [],
                };
            } else {
                payload = {
                    _status,
                    error: `The item with the ID "${id}" is of type "${set.type}", not "action-set".`,
                };
            }
        } else {
            payload = {
                _status,
                error: `No item with the ID "${id}" found.`,
            };
        }

        res.contentType('application/json');
        res.status(_status);
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/action-set/:id/trigger/:slug',
    method: 'get',
    response: (req, res) => {
        const { id, slug } = req.params;
        let _status: number = 404;
        let payload: GetActionSetTriggerPayload | APIError;

        const set = espresso.store.get<Item[]>('items').find((i) => i.id === id);
        const trigger = espresso.triggers.find((t) => t.slug === slug);

        if (trigger) {
            if (set) {
                if (set.type === 'action-set') {
                    const settings = set.settings.find((t) => t.for === slug);

                    if (settings) {
                        _status = 200;
                        payload = { settings, trigger, _status };
                    } else if (!trigger.settings) {
                        _status = 200;
                        payload = { settings: null, trigger, _status };
                    } else {
                        payload = {
                            _status,
                            error: `The item with the ID "${id}" does not have trigger settings for the "${slug}" trigger.`,
                        };
                    }
                } else {
                    payload = {
                        _status,
                        error: `The item with the ID "${id}" is of type "${set.type}", not "action-set".`,
                    };
                }
            } else {
                payload = {
                    _status,
                    error: `No item with the ID "${id}" found.`,
                };
            }
        } else {
            payload = {
                _status,
                error: `No trigger with slug "${slug}" found.`,
            };
        }

        res.contentType('application/json');
        res.status(_status);
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/action-set/:id/trigger/:slug',
    method: 'put',
    response: (req, res) => {
        const { id, slug } = req.params;
        const items = espresso.store.get<Item[]>('items');
        let _status: number = 404;
        let payload: PutActionSetTriggerPayload | APIError;

        const setIndex = items.findIndex((i) => i.id === id);

        if (setIndex > -1) {
            const set = items[setIndex];

            if (set.type === 'action-set') {
                const triggerIndex = set.settings.findIndex((t) => t.for === slug);

                if (triggerIndex > -1) {
                    espresso.store.set(`items.${setIndex}.settings.${triggerIndex}`, req.body);
                    _status = 200;
                    payload = { settings: req.body as ActionSetSetting, _status };
                } else {
                    payload = {
                        _status,
                        error: `The item with the ID "${id}" does not have trigger settings for the "${slug}" trigger.`,
                    };
                }
            } else {
                payload = {
                    _status,
                    error: `The item with the ID "${id}" is of type "${set.type}", not "action-set".`,
                };
            }
        } else {
            payload = {
                _status,
                error: `No item with the ID "${id}" found.`,
            };
        }

        res.contentType('application/json');
        res.status(_status);
        res.send(JSON.stringify(payload, null, 4));
    },
});