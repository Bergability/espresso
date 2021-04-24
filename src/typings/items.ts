interface ItemBase {
    id: string;
    type: string;
    name: string;
    parent: null | string;
}

export interface Folder extends ItemBase {
    type: 'folder';
    color: string;
}

export interface ActionSet extends ItemBase {
    type: 'action-set';
    active: boolean;
    cooldown: number;
    triggers: string[];
    actions: string[];
    settings: ActionSetSetting[];
}

export interface ActionSetSetting {
    for: string;
    [key: string]: any;
}

export interface List extends ItemBase {
    type: 'list';
    items: string[];
    message?: string;
    managed?: boolean;
}

export type Item = Folder | ActionSet | List;
export type ItemType = Item['type'];
