import { v4 as uuid } from 'uuid';
import { shell, powerMonitor } from 'electron';
import { getColorValue } from '../utilities';

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
        if (typeof string !== 'string') return string;

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

                case 'string':
                    break;

                default:
                    return;
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
        getColorValue,
    };
}

const espresso = new EspressoClass();

export type Espresso = EspressoClass;
export default espresso;

// @ts-ignore
global.espresso = espresso;

// Run any store updates
espresso.store.init();
espresso.events.dispatch('espresso:init');

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
