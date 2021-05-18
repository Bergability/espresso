import React, { createContext, useEffect, useState } from 'react';
import { EspressoNotification } from '@typings/espresso';
import api from '@utilities/api';
import { NotificationPayload } from '@typings/api';

type Add = (notification: EspressoNotification) => void;
type Remove = (id: string) => void;

class NotificationSocket {
    private socket = new WebSocket('ws://localhost:23167');
    private addNotification: Add;
    private removeNotification: Remove;
    private reconnect: NodeJS.Timeout | null = null;

    constructor(add: Add, remove: Remove) {
        this.addNotification = add;
        this.removeNotification = remove;

        this.init();
    }

    private init() {
        this.socket = new WebSocket('ws://localhost:23167');
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    private onOpen() {
        console.log('ws open');

        if (this.reconnect) clearInterval(this.reconnect);
    }

    private onClose() {
        console.log('ws closed');

        if (this.reconnect) clearInterval(this.reconnect);

        // @ts-ignore
        this.reconnect = setInterval(() => {
            console.log('interval');

            this.init();
        }, 5000);
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
}

const NotificationContext = createContext<NotificationPayload>({ notifications: [] });

export class NotificationContextWrapper extends React.Component<{}, NotificationPayload> {
    private socket = new WebSocket('ws://localhost:23167');
    private reconnect: NodeJS.Timeout | null = null;

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

        this.init();
    }

    private init() {
        this.socket = new WebSocket('ws://localhost:23167');
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    private onOpen() {
        if (this.reconnect) clearInterval(this.reconnect);
    }

    private onClose() {
        if (this.reconnect) clearInterval(this.reconnect);

        // @ts-ignore
        this.reconnect = setInterval(() => {
            this.init();
        }, 5000);
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

    public render() {
        return <NotificationContext.Provider value={this.state}>{this.props.children}</NotificationContext.Provider>;
    }
}
export default NotificationContext;
