import Store from 'electron-store';
import { Item, ActionSet, ActionSetV1 } from '@typings/items';
import { Action } from '@typings/espresso';
import { SchemaUpdater, Updater } from '@typings/updater';
import { Object } from '@typings/inputs';
import espresso from './espresso';

interface State {
    items: Item[];
    actions: Action[];
    plugins: string[];
    port: number;
    version: string;
    [key: string]: any;
}

/**
 * State and data manager for Espresso
 */
export default class EspressoStore {
    private config = new Store<State>({
        name: 'espresso-config',
        defaults: {
            items: [],
            actions: [],
            plugins: [],
            notifications: [],
            port: 23167,
            version: '1.0.0',
        },
    });

    private configUpdater: Updater[] = [];
    private actionUpdater: Updater[] = [];
    private notificationUpdater: Updater[] = [];
    private itemUpdater: SchemaUpdater[] = [
        {
            slug: 'action-set',
            updates: [
                {
                    from: '1.0.0',
                    version: '1.1.0',
                    updater: (set: ActionSetV1): ActionSet => {
                        return {
                            ...set,
                            cooldown: 1,
                            cooldownUnit: 'seconds',
                            useCooldown: false,
                        };
                    },
                },
            ],
        },
    ];

    constructor() {
        this.config.set(this.runUpdates(this.configUpdater, this.config.store));
    }

    public init() {
        /**
         * Update all items
         */
        const updateItem = (item: Item) => {
            const updater = this.itemUpdater.find((u) => u.slug === item.type);
            if (!updater) return item;

            return this.runUpdates(updater.updates, item) as Item;
        };

        const items = this.config.get('items');
        this.config.set(
            'items',
            items.reduce<Item[]>((acc, item) => {
                return [...acc, updateItem(item)];
            }, [])
        );

        // const actions = this.config.get('actions');

        // this.config.set(
        //     'actions',
        //     actions.reduce<Action[]>((acc, action) => {
        //         return [...acc, this.runUpdates(this.actionUpdater, action) as Action];
        //     }, [])
        // );
    }

    public runUpdates<Prev extends Object = {}, Next extends Object = {}>(updaters: Updater[], object: Prev): Next {
        if (!object.version) return (object as unknown) as Next;

        const getVersion = () => {
            return object.version;
        };

        while (updaters.find((u) => u.from === getVersion())) {
            const updater = updaters.find((u) => u.from === getVersion());
            if (updater) object = updater.updater({ ...object, version: updater.version });
        }

        return (object as unknown) as Next;
    }

    public onChange(key: string, callback: () => void) {
        this.config.onDidChange(key, callback);
    }

    public set(path: string, value: any) {
        this.config.set(path, value);
    }

    /**
     * Get a value from the store object based on a dot notated path.
     *
     * @param path Dot notated path to the value to be retrieved.
     *
     * @returns The value retrieved from the store object. Will be undefined if no value was found.
     */
    public get<T = unknown>(path: string) {
        return this.config.get(path) as T;
    }

    /**
     * Delete a value from the store object based on a dot notated path.
     *
     * @param path Dot notated path to the value to delete.
     */
    public delete(path: string) {
        // @ts-ignore
        this.config.delete(path);
    }
}
