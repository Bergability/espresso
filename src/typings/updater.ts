export interface Updater {
    version: string;
    from: string;
    updater: (object: any) => any;
}

export interface SchemaUpdater {
    slug: string;
    updates: Updater[];
}
