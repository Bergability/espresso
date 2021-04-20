import { Crumb } from '@components/app-bar';
import { Action, ActionSchema, TriggerSchema } from './espresso';
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

export interface GetItemPayload {
    items: Item[];
    _status: number;
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
}

export interface GetFolderPayload {
    folder: Folder;
    items: Item[];
    crumbs: Crumb[];
}
