import espresso from '../../core/espresso';

espresso.server.register({
    path: '/api',
    method: 'get',
    response: (req, res) => {
        res.type('text/plain');
        res.send('Welcome to the Espresso API!');
    },
});

import './action-set';
import './items';
import './options';
import './triggers';
