import { v4 as uuid } from 'uuid';
import espresso from './espresso';
import { EspressoNotification } from '../typings/espresso';

export default class EspressoNotifications {
    public add(notification: Omit<EspressoNotification, 'id' | 'version' | 'timestamp'>): string {
        const id = uuid();
        const notifications = espresso.store.get('notifications') as EspressoNotification[];
        const newNotification: EspressoNotification = { id, version: '1.0.0', timestamp: new Date().getTime(), ...notification };

        espresso.store.set('notifications', [newNotification, ...notifications]);
        espresso.events.dispatch('espresso:notification-added', newNotification);

        return id;
    }

    public getAll() {
        return espresso.store.get('notifications') as EspressoNotification[];
    }

    public get(id: string) {
        const notifications = espresso.store.get('notifications') as EspressoNotification[];
        return notifications.find((n) => n.id === id);
    }

    public dismiss(id: string) {
        const notifications = espresso.store.get('notifications') as EspressoNotification[];
        espresso.store.set(
            'notifications',
            notifications.filter((n) => n.id !== id)
        );
        espresso.events.dispatch('espresso:notification-dismissed', id);
    }
}
