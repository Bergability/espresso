import React, { useContext, useState } from 'react';
import EspressoAppBar, { Crumb } from '@components/app-bar';
import api from '@utilities/api';
import { EspressoNotification } from '@typings/espresso';
import { Button, Icon, Paper, Typography, ButtonGroup, Tooltip } from '@material-ui/core';
import { openInBrowser, getColorValue } from '@utilities';

import './notifications.scss';
import NotificationContext from 'src/contexts/notifications';

const NotificationDisplay: React.FC<{ notification: EspressoNotification }> = ({ notification }) => {
    const [hover, updateHover] = useState(false);
    const dismissNotification = (id: string) => {
        api.fetch(`/notifications/${id}`, 'delete').catch((e) => {
            console.log(e);
        });
    };

    const pinNotification = (id: string) => {
        api.fetch(`/notifications/${id}/pin`, 'put', JSON.stringify({ pinned: true })).catch((e) => {
            console.log(e);
        });
    };

    const unpinNotification = (id: string) => {
        api.fetch(`/notifications/${id}/pin`, 'put', JSON.stringify({ pinned: false })).catch((e) => {
            console.log(e);
        });
    };

    const getExactTime = (timestamp: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const date = new Date(timestamp);
        const now = Date.now();
        const diff = now - timestamp;
        const hours = date.getHours();
        const minutes = `0${date.getMinutes()}`.substr(-2);
        const period = hours >= 12 ? 'PM' : 'AM';
        const day = days[date.getDay()];

        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} @ ${hours > 12 ? hours - 12 : hours}:${minutes} ${period}`;
    };

    const getSimpleTime = (timestamp: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const date = new Date(timestamp);
        const now = Date.now();
        const diff = now - timestamp;
        const hours = date.getHours();
        const minutes = `0${date.getMinutes()}`.substr(-2);
        const period = hours >= 12 ? 'PM' : 'AM';
        const day = days[date.getDay()];

        if (diff <= 2 * 60000) return 'Just now';
        else if (diff <= 59 * 60000) return `${Math.floor((now - timestamp) / 60000)} mins ago`;
        else if (diff <= 85 * 60000) return 'An hour ago';
        else if (diff <= 24 * 60 * 60000) return `${Math.floor((now - timestamp) / (60 * 60000))} hours ago`;
        else if (diff <= 48 * 60 * 60000) return `Yesterday at ${hours}:${minutes} ${period}`;
        else if (diff <= 7 * 24 * 60 * 60000) `${day} at ${hours}:${minutes} ${period}`;
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const color = getColorValue(notification.color || 'white');

    return (
        <Paper key={notification.id} className="notification" style={{ borderLeftColor: color !== null ? color.hex : 'white' }}>
            {notification.dismissible === false ? null : (
                <div className="notification-base-actions">
                    <ButtonGroup
                        variant="outlined"
                        className={hover ? 'MuiPaper-elevation5' : 'MuiPaper-elevation1'}
                        onMouseEnter={() => {
                            updateHover(true);
                        }}
                        onMouseLeave={() => {
                            updateHover(false);
                        }}
                    >
                        <Tooltip title={notification.pinned ? 'Unpin notification' : 'Pin notification'}>
                            <Button
                                onClick={() => {
                                    if (notification.pinned) unpinNotification(notification.id);
                                    else pinNotification(notification.id);
                                }}
                            >
                                <Icon fontSize="small" style={{ transform: notification.pinned ? 'rotate(0deg)' : 'rotate(45deg)' }}>
                                    push_pin
                                </Icon>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Dismiss notification">
                            <Button
                                onClick={() => {
                                    dismissNotification(notification.id);
                                }}
                            >
                                <Icon fontSize="small" color="error">
                                    delete
                                </Icon>
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </div>
            )}
            <div className="padded">
                <Typography className="notification-title">
                    {notification.title} -&nbsp;
                    <Tooltip title={getExactTime(notification.timestamp)} placement="top" arrow>
                        <span>{getSimpleTime(notification.timestamp)}</span>
                    </Tooltip>
                </Typography>
                <Typography className="notification-message">{notification.message}</Typography>

                {notification.actions ? (
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
                    </div>
                ) : null}
            </div>
        </Paper>
    );
};

const NotificationsRoute: React.FC = () => {
    const { notifications, pinned } = useContext(NotificationContext);

    const crumbs: Crumb[] = [
        { link: '/', text: 'My Items', type: 'link' },
        { link: '/notifications', text: 'Notifications', type: 'link' },
    ];

    return (
        <>
            <EspressoAppBar crumbs={crumbs} />

            <div className="route-wrapper" style={{ paddingTop: 25 }}>
                {pinned.length ? (
                    <div>
                        <Typography className="notification-section-header">Pinned notifications</Typography>
                        {pinned.map((notification) => {
                            return <NotificationDisplay key={notification.id} notification={notification} />;
                        })}
                    </div>
                ) : null}

                {pinned.length > 0 && notifications.length > 0 ? <hr className="notification-section-divider" /> : null}

                {notifications.length ? (
                    <div>
                        <Typography className="notification-section-header">Notifications</Typography>
                        {notifications.map((notification) => {
                            return <NotificationDisplay key={notification.id} notification={notification} />;
                        })}
                    </div>
                ) : null}

                {notifications.length === 0 && pinned.length === 0 ? <Typography>No notifications</Typography> : null}
            </div>
        </>
    );
};

export default NotificationsRoute;
