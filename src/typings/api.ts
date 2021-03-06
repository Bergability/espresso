import { Crumb } from '@components/app-bar';
import { Action, ActionSchema, TriggerSchema, Variable, EspressoNotification } from './espresso';
import { ActionSet, Item, ActionSetSetting, Folder } from './items';

type ServerMethod = 'get' | 'post' | 'put' | 'delete';

interface APILink {
    method: ServerMethod;
    path: string;
}

export interface APIError {
    _status: number;
    error: string;
}

export interface GetItemsPayload {
    items: Item[];
    _status: number;
}

export interface GetItemPayload {
    item: Item;
    crumbs: Crumb[];
}

export interface PostPutItemPayload {
    item: Item;
    _status: number;
}

export interface GetPutActionSetPayload {
    set: ActionSet;
    actions: Action[];
    crumbs: Crumb[];
    // TODO add crumbs!
    _status: number;
}

export interface GetActionSetTriggerPayload {
    settings: ActionSetSetting | null;
    trigger: TriggerSchema;
    crumbs: Crumb[];
    _status: number;
}

export interface PutActionSetTriggerPayload {
    settings: ActionSetSetting;
    _status: number;
}

export interface NewActionRequestPayload {
    slug: string;
    set: string;
    actionId?: string;
}

export interface PostActionPayload {
    id: string;
    action: Action;
}

export interface GetActionPayload {
    action: Action;
    crumbs: Crumb[];
    schema: ActionSchema;
    variables: Variable[];
}

export interface GetFolderPayload {
    folder: Folder;
    items: Item[];
    crumbs: Crumb[];
}

export interface Plugin {
    slug: string;
    version: string;
    name: string;
    path: string;
    settings?: string;
}

export type GetPluginsPayload = Plugin[];

export interface NotificationPayload {
    notifications: EspressoNotification[];
    pinned: EspressoNotification[];
    count: number;
}
