import espresso from '../core/espresso';

espresso.server.register({
    method: 'get',
    path: '/',
    response: (req, res) => {
        const lines: string[] = [
            'Welcome to the Espresso server!',
            'Below is a list of all registered server routes.',
            '',
            'Note that this is not only an API, the server can serve static files,',
            'dynamic content, or anything else that might be needed for the Espresso App or plugins',
            '',
            'METHOD:    PATH:',
            '-------------------------------------------------',
        ];

        const routes = espresso.server.getAll().sort((a, b) => {
            if (a.path === b.path) {
                return 0;
            }

            return a.path > b.path ? 1 : -1;
        });

        routes.forEach(({ method, path, category, description }) => {
            const format = () => {
                switch (method) {
                    case 'get':
                    case 'put':
                        // Add 3 spaces
                        method += '   ';
                        break;

                    case 'post':
                        method += '  ';
                        break;
                }

                if (path === '/') path += '            <---------- YOU ARE HERE!';

                return [`${method.toUpperCase()}  -  ${path}`];
            };

            lines.push(...format());
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
