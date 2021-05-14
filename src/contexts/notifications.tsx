import React, { createContext, useEffect, useState } from 'react';
import { EspressoNotification } from '@typings/espresso';
import api from '@utilities/api';
import { NotificationPayload } from '@typings/api';

const NotificationContext = createContext<NotificationPayload>({ notifications: [] });

export class NotificationContextWrapper extends React.Component<{}, NotificationPayload> {
    private socket = new WebSocket('ws://localhost:23167');
    constructor(prop: any) {
        super(prop);

        this.state = { notifications: [] };

        api.fetch<NotificationPayload>('/notifications', 'get')
            .then((res) => {
                this.setState(() => {
                    return res;
                });
            })
            .catch((e) => {
                console.log(e);
            });

        this.socket.onmessage = this.onMessage.bind(this);
    }

    private addNotification(notification: EspressoNotification) {
        this.setState((state) => ({
            notifications: [notification, ...state.notifications],
        }));
    }

    private removeNotification(id: string) {
        this.setState((state) => {
            return { notifications: state.notifications.filter((n) => n.id !== id) };
        });
    }

    private onMessage(message: MessageEvent) {
        const { event, data } = JSON.parse(message.data) as { event: string; data: any };

        switch (event) {
            case 'espresso:notification-added':
                this.addNotification(data as EspressoNotification);
                break;

            case 'espresso:notification-dismissed':
                this.removeNotification(data as string);
                break;
        }
    }

    public render() {
        return <NotificationContext.Provider value={this.state}>{this.props.children}</NotificationContext.Provider>;
    }
}
export default NotificationContext;
