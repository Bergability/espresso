import { Option, Input, Object } from '@typings/inputs';

export interface Variable {
    name: string;
    description?: string;
}

export interface TriggerSchema {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
    version: string;
    settings?: Input<Object>[];
    variables?: Variable[] | ((triggerSettings: any) => Variable[]);
    getVariables?: (triggerData: any, triggerSettings: any) => Object;
    predicate?: (triggerData: any, triggerSettings: any) => boolean;
}

export interface EspressoOptions {
    slug: string;
    get: () => Promise<Option[]>;
}

export interface ActionSchema {
    slug: string;
    name: string;
    provider: string;
    catigory: string;
    description: string;
    version: string;
    children?: boolean;
    settings?: Input<Object>[];
    // TODO figure out why types are not working
    run: (triggerSettings: Object, actionSettings: any, variables: Object, children?: string[]) => Promise<void>;
}

export interface Action<Settings extends Object = {}> {
    id: string;
    slug: string;
    set: string;
    version: string;
    actions: string[];
    settings: Settings;
}
