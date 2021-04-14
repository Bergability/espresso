import Server from './server';
import Store from './store';

class Espresso {
    public server = new Server();
    public store = new Store();
}

const espresso = new Espresso();

// Start the server
const port = espresso.store.get('port');
espresso.server.start(port);

export default espresso;
