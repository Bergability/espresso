import { v4 as uuid } from 'uuid';

/**
 * The base interface for registerable items.
 */
interface RegistrarBase {
    id: string;
}

/**
 * Configuration object required to make a new registrar.
 */
interface RegistrarConfig {
    registeredEvent?: string;
    deregisterEvent?: string;
}

/**
 * Class to register, deregister, and interface custom objects.
 * Each object will be assgined an ID when registered.
 *
 * This class is to be used for items that do not persist on app reload
 *
 * @param config The configuration object required to create a new registrar.
 */
export default class EspressoRegistrar<RegisterType extends object> {
    constructor(config: RegistrarConfig = {}) {
        this.registeredEvent = config.registeredEvent ? config.registeredEvent : undefined;
        this.deregisterEvent = config.deregisterEvent ? config.deregisterEvent : undefined;
    }

    /**
     * Slug of the event that is dispatched when a new item is registered.
     */
    protected registeredEvent?: string;

    /**
     * Slug of the event that is dispatched when an item is deregistered.
     */
    protected deregisterEvent?: string;

    protected preRegister?: (item: RegisterType) => boolean;
    protected postRegister?: (itemId: string) => void;

    protected preRemove?: (itemId: string) => boolean;
    protected postRemove?: (itemId: string) => void;

    /**
     * Internal array of all registered items.
     */
    protected items: (RegistrarBase & RegisterType)[] = [];

    /**
     * Apply the base properties of the RegistrarBase to a new item.
     *
     * @param item The item to be registered.
     *
     * @returns The item with the added RegistrarBase properties.
     */
    protected applyBase: (item: RegisterType) => RegisterType & RegistrarBase = (item) => {
        const id = uuid();
        return {
            id,
            ...item,
        };
    };

    /**
     * Register an item with this registrar.
     *
     * @param item The item to be registered.
     *
     * @returns The ID of the registered item.
     */
    public register: (item: RegisterType) => string | false = (item) => {
        // Run pre register
        if (this.preRegister) {
            const shouldRegister = this.preRegister(item);
            if (!shouldRegister) return false;
        }
        const newItem = this.applyBase(item);
        this.items.push(newItem);
        // TODO turn this back on after the Espresso object has been created
        // if (this.registeredEvent) espresso.events.dispatch(this.registeredEvent, newItem.id);

        // Run post register
        if (this.postRegister) {
            this.postRegister(newItem.id);
        }
        return newItem.id;
    };

    /**
     * Add an exsiting item to the internal array of items.
     *
     * @param items A single item object or an array of item objects.
     *
     * @returns Returns the number of items pushed into the internal items array.
     */
    public add: (items: (RegistrarBase & RegisterType) | (RegistrarBase & RegisterType)[]) => number = (items = []) => {
        if (!Array.isArray(items)) {
            items = [items];
        }

        // @ts-ignore
        items.forEach((item, index) => (items[index] = this.applyBase(item)));

        this.items = [...this.items, ...items];
        return items.length;
    };

    /**
     * Deregister an item with this registrar.
     *
     * @param id The ID of the item to be deregistered.
     *
     * @returns Returns true if item is deregistered or false if no item with the specified ID is not found.
     */
    public remove: (id: string) => boolean = (id) => {
        if (this.preRemove && !this.preRemove(id)) {
            return false;
        }

        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) return false;
        this.items.splice(index, 1);
        // TODO turn this back on after the Espresso object has been created
        // if (this.deregisterEvent) espresso.events.dispatch(this.deregisterEvent, id);

        if (this.postRemove) this.postRemove(id);

        return true;
    };

    /**
     * Clear the entire items array.
     */
    public clear: () => void = () => {
        this.items = [];
    };

    /**
     * Filter the items registered with this registrar.
     * This function is an aliase of Array.filter.
     */
    public filter: (callback: (item: RegistrarBase & RegisterType) => boolean) => (RegistrarBase & RegisterType)[] = (callback) => {
        return this.items.filter(callback);
    };

    /**
     * Find an item registered with this registrar.
     * This function is an aliase of Array.find.
     */
    public find: (callback: (item: RegistrarBase & RegisterType) => boolean) => (RegistrarBase & RegisterType) | undefined = (callback) => {
        return this.items.find(callback);
    };

    /**
     * Find the index of an item registered with this registrar.
     * This function is an aliase of Array.findIndex.
     */
    public findIndex: Array<RegistrarBase & RegisterType>['findIndex'] = (callback) => {
        return this.items.findIndex(callback);
    };

    /**
     * Get all items registered witht his registrar.
     *
     * @returns An array of items.
     */
    public getAll: () => (RegistrarBase & RegisterType)[] = () => {
        return [...this.items];
    };

    /**
     * Retrieved a specific item by it's ID.
     *
     * @param id The ID of the item to be retrieved.
     *
     * @returns An item that has the specified ID or undefined if no item is found.
     */
    public getById: (id: string) => (RegistrarBase & RegisterType) | undefined = (id) => {
        return this.find((item) => item.id === id);
    };

    /**
     * Get the index of a specific item by it's ID.
     *
     * @param id The ID of the item to be indexed.
     *
     * @returns The index of the item with the specified ID or -1 if no item is found.
     */
    public getIndexById: (id: string) => number = (id) => {
        return this.items.findIndex((item) => item.id === id);
    };
}
