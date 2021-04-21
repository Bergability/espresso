import { Option, Input, Object } from '@typings/inputs';

export interface TriggerSchema {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
    settings?: Input<Object>[];
    predicate?: (triggerData: any, triggerSettings: any) => boolean;
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
    description: string;
    children?: boolean;
    settings?: Input<Object>[];
    // TODO figure out why types are not working
    run: (triggerSettings: Object, actionSettings: any, variables: Object, children?: string[]) => Promise<void>;
}

export interface Action<Settings extends Object = {}> {
    id: string;
    slug: string;
    set: string;
    actions: string[];
    settings: Settings;
}
