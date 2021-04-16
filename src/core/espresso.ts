import Server from './server';
import Store from './store';
import Triggers from './triggers';
import Options from './options';

class Espresso {
    public server = new Server();
    public store = new Store();
    public triggers = new Triggers();
    public options = new Options();
}

const espresso = new Espresso();

// Start the server
const port = espresso.store.get('port');
espresso.server.start(port);

export default espresso;
