import { v4 as uuid } from 'uuid';
import { shell, powerMonitor } from 'electron';

import Actions from './actions';
import Events from './events';
import Notifications from './notifications';
import Server from './server';
import Store from './store';
import Tokens from './tokens';
import Triggers from './triggers';
import Options from './options';
import Plugins, { Plugin } from './plugins';

class EspressoClass {
    public actions = new Actions();
    public events = new Events();
    public notifications = new Notifications();
    public server = new Server();
    public store = new Store();
    public tokens = new Tokens();
    public triggers = new Triggers();
    public options = new Options();
    public plugins = new Plugins();

    public parseVariables(string: string, variables: { [key: string]: any }) {
        Object.keys(variables).forEach((variable) => {
            // TODO add better dev logging for when a var isn't a string
            switch (typeof variables[variable]) {
                case 'number':
                    variables[variable] = variables[variable].toString();
                    break;

                case 'boolean':
                    variables[variable] = variables[variable] === true ? 'true' : 'false';
                    break;

                case 'object':
                    variables[variable] = JSON.stringify(variables[variable]);
                    break;

                case 'undefined':
                    variables[variable] = '';
                    break;
            }

            const regex = new RegExp(`\\[${variable}\\]`, 'g');
            string = string.replaceAll(regex, variables[variable].trim());
        });
        return string;
    }

    public utilities = {
        openInBrowser: (url: string) => {
            shell.openExternal(url);
        },
        uuid: () => {
            return uuid();
        },
    };
}

const espresso = new EspressoClass();
espresso.events.dispatch('espresso:init');

// @ts-ignore
global.espresso = espresso;

// Start the server
const port = espresso.store.get<number>('port');
espresso.server.start(port);
espresso.events.dispatch('espresso:server-loaded');

// Load plugins
espresso.plugins.load(espresso.store.get('plugins') as Plugin[], () => {
    espresso.events.dispatch('espresso:plugins-loaded');
});

// When the system suspends
powerMonitor.addListener('suspend', () => {
    espresso.events.dispatch('espresso:power-suspend');
});

// When the system resumes
powerMonitor.addListener('resume', () => {
    espresso.events.dispatch('espresso:power-resume');
});

export type Espresso = EspressoClass;
export default espresso;

const foo = {
    benefit_end_month: 0,
    user_name: 'bergability',
    display_name: 'Bergability',
    channel_name: 'bergability',
    user_id: '113128856',
    channel_id: '113128856',
    recipient_id: '86338165',
    recipient_user_name: 'bethsdelfino',
    recipient_display_name: 'bethsdelfino',
    time: '2021-05-16T22:37:09.683207287Z',
    sub_message: { message: '', emotes: null },
    sub_plan: '1000',
    sub_plan_name: 'Channel Subscription to Bergability',
    months: 45,
    context: 'subgift',
    is_gift: true,
    multi_month_duration: 1,
};
