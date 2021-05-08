import { shell, powerMonitor } from 'electron';

import Actions from './actions';
import Events from './events';
import Server from './server';
import Store from './store';
import Tokens from './tokens';
import Triggers from './triggers';
import Options from './options';
import Plugins, { Plugin } from './plugins';

class EspressoClass {
    public actions = new Actions();
    public events = new Events();
    public server = new Server();
    public store = new Store();
    public tokens = new Tokens();
    public triggers = new Triggers();
    public options = new Options();
    public plugins = new Plugins();

    public parseVariables(string: string, variables: { [key: string]: string }) {
        Object.keys(variables).forEach((variable) => {
            const regex = new RegExp(`\\[${variable}\\]`, 'g');
            string = string.replaceAll(regex, variables[variable].trim());
        });
        return string;
    }

    public utilities = {
        openInBrowser: (url: string) => {
            shell.openExternal(url);
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
