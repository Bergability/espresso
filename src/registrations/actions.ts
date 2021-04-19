import espresso from '../core/espresso';
import { Input } from '@typings/inputs';

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
    settings: getSettings('The action set to toggle.'),
    run: () => {},
});

espresso.actions.register({
    slug: 'espresso-disable-action-set',
    name: 'Disable action set',
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Disable a selected action set.',
    settings: getSettings('The action set to disable.'),
    run: () => {},
});

espresso.actions.register({
    slug: 'espresso-enable-action-set',
    name: 'Enable action set',
    catigory: 'Utilities',
    provider: 'Espresso',
    description: 'Enable a selected action set.',
    settings: getSettings('The action set to enable.'),
    run: () => {},
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
    settings: repeatSettings,
    run: () => {},
});

interface EspressoWaitSettings {
    duration: number;
    unit: string;
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
    settings: waitSettings,
    run: () => {},
});

interface TwitchSendChatSettings {
    message: string;
}

const twitchSendMessageSettings: Input<TwitchSendChatSettings>[] = [
    {
        type: 'text',
        label: 'Message',
        key: 'message',
        helper: 'The message to send in Twitch chat.',
        default: 'Hello world!',
    },
];

espresso.actions.register({
    slug: 'twitch-send=chat=message',
    name: 'Send chat message',
    catigory: 'Chat',
    provider: 'Twitch',
    description: 'Send a message in Twitch chat.',
    settings: twitchSendMessageSettings,
    run: () => {},
});

espresso.actions.register({
    slug: 'hue-turn-on-light',
    name: 'Turn on light',
    provider: 'Philips',
    catigory: 'Hue',
    description: 'Turn on a selected Philips Hue light.',
    settings: [],
    run: () => {},
});

espresso.actions.register({
    slug: 'hue-change-light-color',
    name: 'Change light color',
    provider: 'Philips',
    catigory: 'Hue',
    description: 'Change the color of a selected Philips Hue light.',
    settings: [],
    run: () => {},
});
