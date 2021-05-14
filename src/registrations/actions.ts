import espresso from '../core/espresso';
import { Condition, Input } from '@typings/inputs';

/**
 *
 * Toggle action set action
 *
 */
interface EspressoToggleSetSettings {
    set: string;
    state: 'toggle' | 'enabled' | 'disabled';
}

const toggleSettings: Input<EspressoToggleSetSettings>[] = [
    {
        type: 'select',
        label: 'Action set',
        key: 'set',
        helper: 'The action set to change the state of.',
        options: 'espresso:action-sets',
        default: '',
    },
    {
        type: 'select',
        label: 'State',
        key: 'state',
        helper: 'The state to set the action set to.',
        default: 'toggle',
        options: [
            { text: 'Enable', value: 'enable' },
            { text: 'Disable', value: 'disable' },
            { text: 'Toggle', value: 'toggle' },
        ],
    },
];

espresso.actions.register({
    slug: 'espresso-toggle-action-set',
    name: 'Toggle action set',
    catigory: 'Utilities',
    provider: 'Espresso',
    version: '1.0.0',
    description: 'Toggle a selected action set on or off.',
    // @ts-ignore
    settings: toggleSettings,
    run: async (triggerSettings, ActionSettings) => {},
});

/**
 *
 * Repeat action
 *
 */
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
    version: '1.0.0',
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

/**
 *
 * Wait action
 *
 */
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
    version: '1.0.0',
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

/**
 *
 * Send notification
 *
 */
interface EspressoNotificationSettings extends Object {
    title: string;
    message: string;
}

const notificationSettings: Input<EspressoNotificationSettings>[] = [
    {
        type: 'text',
        label: 'Notification Title',
        key: 'title',
        default: '',
    },
    {
        type: 'text',
        label: 'Notification message',
        key: 'message',
        default: '',
    },
];

espresso.actions.register({
    slug: 'espresso-notification',
    name: 'Send notification',
    catigory: 'Utilities',
    provider: 'Espresso',
    version: '1.0.0',
    description: 'Send a notification to the notification list.',
    // @ts-ignore
    settings: notificationSettings,
    run: async (triggerSettings: Object, actionSettings: EspressoNotificationSettings, triggerData) => {
        espresso.notifications.add({
            title: espresso.parseVariables(actionSettings.title, triggerData),
            message: espresso.parseVariables(actionSettings.message, triggerData),
        });
    },
});

/**
 *
 * Conditional action
 *
 */
// interface CondtionalActionSettings {
//     conditions: Condition[];
//     type: 'or' | 'and';
// }

// const condtionalActionSettings: Input<CondtionalActionSettings, Condition>[] = [
//     {
//         type: 'select',
//         label: 'Evaluation type',
//         key: 'type',
//         default: 'and',
//         options: [
//             { text: 'If all conditions are met', value: 'and' },
//             { text: 'If one or more conditions are met', value: 'or' },
//         ],
//     },
//     {
//         type: 'repeater',
//         label: 'Conditions',
//         key: 'conditions',
//         default: [],
//         emptyLabel: 'No conditions',
//         addLabel: 'Add condition',
//         removeLabel: 'Remove condition',
//         inputs: [
//             {
//                 type: 'text',
//                 key: 'value',
//                 label: 'Value',
//                 default: '',
//             },
//             {
//                 type: 'select',
//                 label: 'Operator',
//                 key: 'operator',
//                 default: 'equal',
//                 options: [
//                     { text: 'Equals', value: 'equal' },
//                     { text: 'Does not equal', value: 'not-equal' },
//                     { text: 'Greater than', value: 'greater-than' },
//                     { text: 'Greater than or equal', value: 'greater-than-or-equal' },
//                     { text: 'Less than', value: 'less-than' },
//                     { text: 'Less than or equal', value: 'less-than-or-equal' },
//                     { text: 'Array length equals', value: 'array-length-equal' },
//                     { text: 'Array length not equal', value: 'array-length-not-equal' },
//                     { text: 'Array length greater than', value: 'array-length-greater-than' },
//                     { text: 'Array length greater than or equal', value: 'array-length-greater-than-or-equal' },
//                     { text: 'Array length less than', value: 'array-length-less-than' },
//                     { text: 'Array length less than or equal', value: 'array-length-less-than-or-equal' },
//                     { text: 'Array contains', value: 'array-contains' },
//                 ],
//             },
//             {
//                 type: 'text',
//                 key: 'comparison',
//                 label: 'Value',
//                 default: '',
//             },
//         ],
//     },
// ];

// espresso.actions.register({
//     slug: 'conditional-actions',
//     name: 'Conditional Actions',
//     children: true,
//     provider: 'Espresso',
//     catigory: 'Utility',
//     description: 'Run actions if set condtions are met.',
//     // @ts-ignore
//     settings: condtionalActionSettings,
//     run: async (triggerSettings, actionSettings, triggerData) => {
//         console.log('here');
//     },
// });
