import React, { useContext } from 'react';
import EspressoAppBar, { Crumb } from '@components/app-bar';
import api from '@utilities/api';
import { EspressoNotification } from '@typings/espresso';
import { Button, IconButton, Icon, Paper, Typography } from '@material-ui/core';
import { openInBrowser } from '@utilities';

import './notifications.scss';
import NotificationContext from 'src/contexts/notifications';

interface NotificationPayload {
    notifications: EspressoNotification[];
    count: number;
}

const NotificationsRoute: React.FC = () => {
    const { notifications } = useContext(NotificationContext);

    const crumbs: Crumb[] = [
        { link: '/', text: 'My Items', type: 'link' },
        { link: '/notifications', text: 'Notifications', type: 'link' },
    ];

    const dismissNotification = (id: string) => {
        api.fetch(`/notifications/${id}`, 'delete').catch((e) => {
            console.log(e);
        });
    };

    return (
        <>
            <EspressoAppBar crumbs={crumbs} />

            <div className="route-wrapper">
                {notifications.map((notification) => {
                    const dismissible = notification.dismissible === undefined ? true : notification.dismissible;

                    return (
                        <Paper key={notification.id} className={`notification ${dismissible ? 'dismissible' : ''}`}>
                            <div className="padded">
                                <Typography className="notification-title">{notification.title}</Typography>
                                <Typography className="notification-message">{notification.message}</Typography>

                                {notification.actions || dismissible ? (
                                    <div className="notification-actions">
                                        {(notification.actions || []).map((action, index) => (
                                            <Button
                                                key={`${notification.id}-${index}`}
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    openInBrowser(action.link);
                                                }}
                                            >
                                                {action.text}
                                            </Button>
                                        ))}

                                        {dismissible ? (
                                            <Button
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    dismissNotification(notification.id);
                                                }}
                                            >
                                                Dismiss
                                            </Button>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </Paper>
                    );
                })}

                {notifications.length === 0 ? <Typography>No notifications</Typography> : null}
            </div>
        </>
    );
};

export default NotificationsRoute;
