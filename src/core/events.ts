import { v4 as uuid } from 'uuid';

interface Listener<T = any> {
    id: string;
    slug: string;
    triggers: boolean;
    callback: (data?: T) => void;
}

export default class EspressoEvents {
    private listeners: Listener[] = [];

    public listen<T = undefined>(slug: string, callback: (data: T) => void, triggers: boolean = false): string {
        const id = uuid();
        this.listeners.push({ id, slug, triggers, callback });

        return id;
    }

    public removeListener(id: string) {
        const length = this.listeners.length;
        this.listeners = this.listeners.filter((l) => l.id !== id);

        return this.listeners.length === length - 1;
    }

    public dispatch<T = any>(slug: string, data?: T) {
        const listeners = this.listeners.filter((l) => l.slug === slug);

        listeners.forEach((l) => {
            l.callback(data);
        });
    }

    public dispatchTrigger<T = any>(slug: string, data?: T) {
        const listeners = this.listeners.filter((l) => l.slug === slug && l.triggers === true);

        listeners.forEach((l) => {
            l.callback(data);
        });
    }
}
