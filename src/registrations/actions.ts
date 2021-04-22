import espresso from '../core/espresso';
import { Input } from '@typings/inputs';
import { resolve } from 'path';

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
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Toggle a selected action set on or off.',
    // @ts-ignore
    settings: getSettings('The action set to toggle.'),
    run: async (triggerSettings, ActionSettings) => {},
});

espresso.actions.register({
    slug: 'espresso-disable-action-set',
    name: 'Disable action set',
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Disable a selected action set.',
    // @ts-ignore
    settings: getSettings('The action set to disable.'),
    run: async (triggerSettings, ActionSettings) => {},
});

espresso.actions.register({
    slug: 'espresso-enable-action-set',
    name: 'Enable action set',
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Enable a selected action set.',
    // @ts-ignore
    settings: getSettings('The action set to enable.'),
    run: async (triggerSettings, ActionSettings) => {},
});

interface EspressoRepeatSettings {
    iterations: number;
}

const repeatSettings: Input<EspressoRepeatSettings>[] = [
    {
        type: 'number',
        label: 'Action set',
        key: 'iterations',
        helper: 'The number of times to repeat the given actions.',
        default: 2,
    },
];

espresso.actions.register({
    slug: 'espresso-repeat',
    name: 'Repeat actions',
    catigory: 'Utilities',
    provider: 'Espresso',
    children: true,
    description: 'Repeat a list of actions a set amount of times.',
    // @ts-ignore
    settings: repeatSettings,
    run: async (triggerSettings, actionSettings: EspressoRepeatSettings, triggerData, children) => {
        // If no children are passed in exit
        if (!children) return;

        try {
            for (let counter = 0; counter < actionSettings.iterations; counter++) {
                await espresso.triggers.runActions(children, triggerSettings, triggerData);
            }
        } catch (e) {
            console.log(e);
            return;
        }
    },
});

interface EspressoWaitSettings extends Object {
    duration: number;
    unit: 'seconds' | 'minutes' | 'hours';
}

const waitSettings: Input<EspressoWaitSettings>[] = [
    {
        type: 'number',
        label: 'Duration',
        key: 'duration',
        helper: 'The length of time to wait.',
        default: 10,
    },
    {
        type: 'select',
        label: 'Unit',
        key: 'unit',
        default: 'seconds',
        options: [
            { text: 'Seconds', value: 'seconds' },
            { text: 'Minutes', value: 'minutes' },
            { text: 'Hours', value: 'hours' },
        ],
    },
];

espresso.actions.register({
    slug: 'espresso-wait',
    name: 'Wait...',
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Wait for a set amount of time.',
    // @ts-ignore
    settings: waitSettings,
    run: (triggerSettings: Object, actionSettings: EspressoWaitSettings) => {
        let unit: number;

        switch (actionSettings.unit) {
            case 'seconds':
                unit = 1000;
                break;

            case 'minutes':
                unit = 60000;
                break;

            case 'hours':
                unit = 3600000;
                break;
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, actionSettings.duration * unit);
        });
    },
});

espresso.actions.register({
    slug: 'hue-turn-on-light',
    name: 'Turn on light',
    provider: 'Philips',
    catigory: 'Hue',
    description: 'Turn on a selected Philips Hue light.',
    settings: [],
    run: async (triggerSettings, ActionSettings) => {},
});

espresso.actions.register({
    slug: 'hue-change-light-color',
    name: 'Change light color',
    provider: 'Philips',
    catigory: 'Hue',
    description: 'Change the color of a selected Philips Hue light.',
    settings: [],
    run: async (triggerSettings, ActionSettings) => {},
});
