import Store from 'electron-store';

interface State {
    items: unknown[];
    port: number;
}

/**
 * State and data manager for Espresso
 */
export default class EspressoStore {
    private config = new Store<State>({
        name: 'espresso-config',
        defaults: {
            items: [],
            port: 23167,
        },
    });

    private validate: () => Promise<void> = async () => {
        // TODO validate
    };

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
    public get: (path: string) => any = (path) => {
        return this.config.get(path);
    };

    /**
     * Delete a value from the store object based on a dot notated path.
     *
     * @param path Dot notated path to the value to be retrieved.
     */
    public delete: (path: string) => void = (path) => {
        // @ts-ignore
        this.config.delete(path);
    };

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
