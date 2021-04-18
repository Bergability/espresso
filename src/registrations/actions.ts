import espresso from '../core/espresso';
import { Input } from '@typings/inputs';
import { settings } from 'cluster';

interface EspressoToggleSetSettings {
    set: string;
}

const getSettings = (helper: string) => {
    const settings: Input<EspressoToggleSetSettings>[] = [
        {
            type: 'select',
            label: 'Action set',
            key: 'set',
            helper,
            options: 'espresso:action-sets',
            default: '',
        },
    ];

    return settings;
};

espresso.actions.register({
    slug: 'espresso-toggle-action-set',
    name: 'Toggle action set',
    catigory: 'Utility',
    provider: 'Espresso',
    settings: getSettings('The action set to toggle.'),
    run: () => {},
});

espresso.actions.register({
    slug: 'espresso-disable-action-set',
    name: 'Disable action set',
    catigory: 'Utility',
    provider: 'Espresso',
    settings: getSettings('The action set to disable.'),
    run: () => {},
});

espresso.actions.register({
    slug: 'espresso-enable-action-set',
    name: 'Enable action set',
    catigory: 'Utility',
    provider: 'Espresso',
    settings: getSettings('The action set to enable.'),
    run: () => {},
});
