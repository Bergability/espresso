import fs from 'fs';
import path from 'path';
import { Manifest } from '@core/plugins';
import espresso from '../../core/espresso';
import { Plugin } from '../../typings/api';

espresso.server.register({
    path: '/api/plugins',
    method: 'get',
    response: (req, res) => {
        const plugins = espresso.store.get('plugins') as Plugin[];
        const port = espresso.store.get('port');

        plugins.forEach((plugin, index) => {
            const manifest = JSON.parse(fs.readFileSync(path.join(plugin.path, 'manifest.json'), 'utf8')) as Manifest;
            if (manifest.settings) {
                plugins[index].settings = `http://localhost:${port}${manifest.settings}`;
            }
        });

        res.contentType('application/json');
        res.send(JSON.stringify(plugins, null, 4));
    },
});

espresso.server.register({
    path: '/api/plugins',
    method: 'post',
    response: (req, res) => {
        const path = req.body.path as string;
        const plugins = espresso.store.get('plugins') as Plugin[];

        if (!path || !path.endsWith('/manifest.json')) {
            res.status(400);
            res.send();
            return;
        }

        const manifest = JSON.parse(fs.readFileSync(path, 'utf8')) as Manifest;

        // Ensure there are no duplicates
        if (plugins.find((p) => p.slug === manifest.slug)) {
            res.status(400);
            res.send();
            return;
        }

        // verify that the manifest is correct
        if (!manifest.name || !manifest.slug || !manifest.version) {
            res.status(400);
            res.send();
            return;
        }

        const slicedPath = path.substr(0, path.length - '/manifest.json'.length);

        const newPlugins: Plugin[] = [
            ...plugins,
            {
                path: slicedPath,
                version: manifest.version,
                name: manifest.name,
                slug: manifest.slug,
            },
        ];

        espresso.store.set('plugins', newPlugins);

        res.contentType('application/json');
        res.send(JSON.stringify(newPlugins, null, 4));
    },
});

espresso.server.register({
    path: '/api/plugins/:slug',
    method: 'delete',
    response: (req, res) => {
        const slug = req.params.slug;
        const plugins = espresso.store.get('plugins') as Plugin[];
        const index = plugins.findIndex((p) => p.slug === slug);

        if (index > -1) {
            const filtered = plugins.filter((p) => p.slug !== slug);

            espresso.store.set('plugins', filtered);

            res.contentType('application/json');
            res.send(JSON.stringify(plugins, null, 4));
            return;
        }

        res.status(400);
        res.contentType('application/json');
        res.send(JSON.stringify(plugins, null, 4));
    },
});
