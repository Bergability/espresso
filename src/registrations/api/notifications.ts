import espresso from '../../core/espresso';

espresso.server.register({
    path: '/api/notifications',
    method: 'get',
    response: (req, res) => {
        const notifications = espresso.notifications.getAll();
        res.json({
            notifications: notifications,
            count: notifications.length,
        });
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
