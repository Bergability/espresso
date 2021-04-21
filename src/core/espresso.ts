import Actions from './actions';
import Server from './server';
import Store from './store';
import Triggers from './triggers';
import Options from './options';
import Plugins from './plugins';

class EspressoClass {
    public actions = new Actions();
    public server = new Server();
    public store = new Store();
    public triggers = new Triggers();
    public options = new Options();
    public plugins = new Plugins();
    public parseVariables(string: string, variables: { [key: string]: string }) {
        Object.keys(variables).forEach((variable) => {
            console.log(variable);
            console.log(variables[variable]);

            const regex = new RegExp(`\\[${variable}\\]`, 'g');
            string = string.replaceAll(regex, variables[variable].trim());
        });

        return string;
    }
}

const espresso = new EspressoClass();

// @ts-ignore
global.espresso = espresso;

// Start the server
const port = espresso.store.get<number>('port');
espresso.server.start(port);

// Load plugins
espresso.plugins.load(espresso.store.get('plugins') as string[]);

export type Espresso = EspressoClass;
export default espresso;
