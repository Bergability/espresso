import { v4 as uuid } from 'uuid';
import Store from 'electron-store';

interface State {
    [key: string]: string;
}

/**
 * State and data manager for Espresso
 */
export default class EspressoStore {
    private config = new Store<State>({
        name: 'espresso-tokens',
        defaults: {},
    });

    public set(token: string): string {
        const id = uuid();
        this.config.set(id, token);
        return id;
    }

    public get(id: string): string | null {
        const token = this.config.get(id);
        if (token) return token;
        return null;
    }

    public update(id: string, token: string) {
        this.config.set(id, token);
    }

    public delete(id: string) {
        const store = this.config.store;
        delete store[id];
        this.config.set('', store);
    }
}
