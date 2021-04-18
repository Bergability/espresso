import espresso from '../../core/espresso';

/**
 *
 * Options
 *
 */
espresso.server.register({
    path: '/api/options',
    method: 'get',
    response: (req, res) => {
        const payload = espresso.options.getAll().reduce<{ slug: string; path: string }[]>((acc, option) => {
            return [
                ...acc,
                {
                    slug: option.slug,
                    path: `/api/options/${option.slug}`,
                },
            ];
        }, []);

        res.contentType('application/json');
        res.send(JSON.stringify(payload, null, 4));
    },
});

espresso.server.register({
    path: '/api/options/:slug',
    method: 'get',
    response: (req, res) => {
        const { slug } = req.params;
        res.contentType('application/json');

        const options = espresso.options.find((o) => o.slug === slug);
        if (!options) {
            res.send(JSON.stringify([], null, 4));
            return;
        }

        res.send(JSON.stringify(options.get(), null, 4));
    },
});
