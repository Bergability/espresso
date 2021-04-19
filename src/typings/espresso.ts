import { Option, Input, Object } from '@typings/inputs';

export interface TriggerSchema {
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

export interface ActionSchema {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
    children?: boolean;
    settings?: Input<Object>[];
    // TODO figure out what this should be
    run: () => void;
}

export interface Action<Settings extends Object = {}> {
    id: string;
    slug: string;
    set: string;
    actions: string[];
    settings: Settings;
}
