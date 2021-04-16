import { Option } from '@typings/inputs';
import espresso from '../core/espresso';

espresso.options.register({
    slug: 'espresso:triggers',
    get: () => {
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
