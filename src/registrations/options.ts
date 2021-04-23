import espresso from '../core/espresso';
import { Option } from '@typings/inputs';
import { Item, ActionSet } from '@typings/items';

espresso.options.register({
    slug: 'espresso:triggers',
    get: async () => {
        return espresso.triggers.getAll().reduce<Option[]>((acc, trigger) => {
            return [
                ...acc,
                {
                    text: trigger.name,
                    value: trigger.slug,
                    catigory: trigger.catigory,
                },
            ];
        }, []);
    },
});

espresso.options.register({
    slug: 'espresso:action-sets',
    get: async () => {
        const items = espresso.store.get('items') as Item[];
        return items.reduce<Option[]>((acc, item) => {
            if (item.type !== 'action-set') return acc;
            return [
                ...acc,
                {
                    text: item.name,
                    value: item.id,
                },
            ];
        }, []);
    },
});
