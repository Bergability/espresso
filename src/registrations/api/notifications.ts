import espresso from '../../core/espresso';
import { EspressoNotification } from '../../typings/espresso';

espresso.server.register({
    path: '/api/notifications',
    method: 'get',
    response: (req, res) => {
        const notifications = espresso.notifications.getAll();

        const sortByTimestamp = (a: EspressoNotification, b: EspressoNotification) => {
            if (a.dismissible === false && b.dismissible !== false) return -1;
            if (a.timestamp > b.timestamp) return -1;
            if (a.timestamp < b.timestamp) return 1;
            return 0;
        };

        res.json({
            notifications: notifications.filter((n) => n.pinned !== true && n.dismissible !== false).sort(sortByTimestamp),
            pinned: notifications.filter((n) => n.pinned === true || n.dismissible === false).sort(sortByTimestamp),
            count: notifications.length,
        });
    },
});

espresso.server.register({
    path: '/api/notifications/:id/pin',
    method: 'put',
    response: (req, res) => {
        const id = req.params.id;
        const { pinned } = req.body;

        const notifications = espresso.store.get<EspressoNotification[]>('notifications');

        const index = notifications.findIndex((n) => n.id === id);

        if (index === -1) {
            res.status(404).send();
            return;
        }

        espresso.store.set(`notifications.${index}.pinned`, pinned);

        res.json({ ...notifications[index], pinned });

        if (pinned === true) espresso.events.dispatch('espresso:notification-pinned', id);
        else espresso.events.dispatch('espresso:notification-unpinned', id);
    },
});

espresso.server.register({
    path: '/api/notifications/:id',
    method: 'delete',
    response: (req, res) => {
        const id = req.params.id;
        espresso.notifications.dismiss(id);

        res.json({ id });
    },
});
