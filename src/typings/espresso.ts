import { Option } from '@typings/inputs';

export interface EspressoTrigger {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
}

export interface EspressoOptions {
    slug: string;
    get: () => Option[];
}
