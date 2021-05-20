import { v4 as uuid } from 'uuid';
import espresso from './espresso';
import { EspressoNotification } from '../typings/espresso';

export default class EspressoNotifications {
    public add(notification: Omit<EspressoNotification, 'id' | 'version'>): string {
        const id = uuid();
        const notifications = espresso.store.get('notifications') as EspressoNotification[];

        espresso.store.set('notifications', [{ id, version: '1.0.0', ...notification }, ...notifications]);
        espresso.events.dispatch('espresso:notification-added', { id, ...notification });

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
