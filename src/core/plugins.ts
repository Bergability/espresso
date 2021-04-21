import fs from 'fs';
import path from 'path';

interface Manifest {
    name: string;
    slug: string;
    load: string[];
}

export default class EspressoPlugins {
    public load(manifests: string[]) {
        manifests.forEach((mainifestPath) => {
            const manifest = JSON.parse(fs.readFileSync(path.join(mainifestPath, 'manifest.json'), 'utf-8')) as Manifest;

            manifest.load.forEach((filePath) => {
                require(path.join(mainifestPath, filePath));
            });
        });
    }
}
