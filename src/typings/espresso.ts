import { Option, Input, Object } from '@typings/inputs';
import { Updater } from './updater';

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
    // Used to list out the variables that the user will see
    variables?: Variable[] | ((triggerSettings: any) => Variable[]);
    // Used to get the variable values at trigger run time
    getVariables?: (triggerData: any, triggerSettings: any) => Object;
    // Used at trigger run time to determine if the trigger should run or not
    predicate?: (triggerData: any, triggerSettings: any) => boolean;
    updater?: Updater[];
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
    updater?: Updater[];
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

export interface EspressoEvent<T = any> {
    event: string;
    data: T;
}

interface NotificationAction {
    text: string;
    link: string;
}

export interface EspressoNotification {
    id: string;
    title: string;
    message: string;
    actions?: NotificationAction[];
    dismissible?: boolean;
    slug?: string;
    version: string;
}
