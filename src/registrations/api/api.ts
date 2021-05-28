import { app } from 'electron';
import espresso from '../../core/espresso';

espresso.server.register({
    path: '/api',
    method: 'get',
    response: (req, res) => {
        res.type('text/plain');
        res.send('Welcome to the Espresso API!');
    },
});

espresso.server.register({
    path: '/api/app/restart',
    method: 'post',
    response: (req, res) => {
        res.send();
        app.relaunch();
        app.exit();
    },
});

espresso.server.register({
    path: '/api/app/settings',
    method: 'get',
    response: (req, res) => {
        res.send({
            config: espresso.store.path,
        });
    },
});

import './action-set';
import './actions';
import './items';
import './notifications';
import './options';
import './plugins';
import './schemas';
import './triggers';
