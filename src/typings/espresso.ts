import { Option, Input, Object } from '@typings/inputs';

export interface EspressoTrigger {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
    settings?: Input<Object>[];
}

export interface EspressoOptions {
    slug: string;
    get: () => Option[];
}
