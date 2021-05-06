import espresso from './espresso';
import fs from 'fs';
import path from 'path';

export interface Manifest {
    name: string;
    slug: string;
    version: string;
    load: string[];
}

export interface Plugin {
    slug: string;
    path: string;
}

export default class EspressoPlugins {
    public load(manifests: Plugin[]) {
        manifests.forEach((m) => {
            const manifest = JSON.parse(fs.readFileSync(path.join(m.path, 'manifest.json'), 'utf-8')) as Manifest;

            manifest.load.forEach((filePath) => {
                require(path.join(m.path, filePath));
            });
        });
    }

    public getPath(slug: string) {
        const plugins = espresso.store.get('plugins') as Plugin[];
        const plugin = plugins.find((p) => p.slug === slug);

        if (plugin) return plugin.path;
        return false;
    }
}
