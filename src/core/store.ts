import Store from 'electron-store';
import { Item } from '@typings/items';
import { Action } from '@typings/espresso';

interface State {
    items: Item[];
    actions: Action[];
    plugins: string[];
    port: number;
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
            port: 23167,
        },
    });

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
     * @param path Dot notated path to the value to be retrieved.
     */
    public delete(path: string) {
        // @ts-ignore
        this.config.delete(path);
    }

    /**
     * Save this.store to a file on the users machine and overwirte this.activeStore with it's value.
     *
     * @returns Always returns true.
     */
    save: () => boolean = () => {
        //   const config = {};
        //   Object.entries(espresso).forEach(([key, entry]) => {
        //     if (entry.toJSON) {
        //       const json = entry.toJSON();

        //       if (json) {
        //         const { slug, value } = entry.toJSON();
        //         config[slug] = value;
        //       }
        //     }
        //   });

        //   this.config.set(config);

        //   espresso.toasts.add({
        //     text: "Changes have been saved",
        //     color: "success"
        //   });
        // return true;
        return false;
    };
}
