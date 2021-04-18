import { EspressoTrigger } from './espresso';
import { ActionSet, Item, ActionSetSetting } from './items';

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
    actions: unknown[];
    // TODO add crumbs!
    _status: number;
}

export interface GetActionSetTriggerPayload {
    settings: ActionSetSetting | null;
    trigger: EspressoTrigger;
    _status: number;
}

export interface PutActionSetTriggerPayload {
    settings: ActionSetSetting;
    _status: number;
}
