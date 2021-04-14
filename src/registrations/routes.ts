import espresso from '../core/espresso';

espresso.server.register({
    method: 'get',
    path: '/',
    response: (req, res) => {
        const lines: string[] = [
            'Welcome to the Espresso server!',
            'Below is a list of all registered server routes. \n',
            '-------------------------------------------------\n',
        ];

        espresso.server.getAll().forEach((route) => {
            lines.push(`${route.method.toUpperCase()} - ${route.path}`);
        });

        res.type('text/plain');
        res.send(lines.join('\n'));
    },
});

espresso.server.register({
    path: '/api',
    method: 'get',
    response: (req, res) => {
        res.type('text/plain');
        res.send('Welcome to the Espresso API!');
    },
});

espresso.server.register({
    path: '/api/items',
    method: 'get',
    response: (req, res) => {
        res.contentType('application/json');
        res.send(JSON.stringify([], null, 4));
        //   res.send(JSON.stringify(espresso.items.toJSON().value, null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'get',
    response: (req, res) => {
        const { id } = req.params;
        //   const items = espresso.items.toJSON();
        //   const item = items.value.find(i => i.id === id);
        const item = false;

        if (item) {
            res.contentType('application/json');
            res.send(JSON.stringify(item, null, 4));
            return;
        }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id',
    method: 'put',
    response: (req, res) => {
        const { id } = req.params;
        //   const item = espresso.items.getById(id);

        //   if (item) {
        //     Object.entries(req.body).forEach(([key, value]) => {
        //       item[key] = value;
        //     });

        //     const json = espresso.items.toJSON().value.find(i => i.id === id);

        //     res.contentType("application/json");
        //     res.send(JSON.stringify(json, null, 4));
        //     return;
        //   }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});

espresso.server.register({
    path: '/api/items/:id/run',
    method: 'post',
    response: (req, res) => {
        const { id } = req.params;
        //   const item = espresso.items.getById(id);

        //   if (item) {
        //     espresso.actions.runSet(id);
        //     res.contentType("application/json");
        //     res.send(
        //       JSON.stringify(
        //         {
        //           success: true
        //         },
        //         null,
        //         4
        //       )
        //     );
        //     return;
        //   }

        const error = {
            status: 404,
            error: 'No item found with specified',
        };
        res.contentType('application/json');
        res.send(JSON.stringify(error, null, 4));
    },
});
