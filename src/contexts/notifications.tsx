import React, { createContext, useEffect, useState } from 'react';
import { EspressoNotification } from '@typings/espresso';
import api from '@utilities/api';
import { NotificationPayload } from '@typings/api';

const NotificationContext = createContext<NotificationPayload>({ notifications: [], pinned: [], count: 0 });

export class NotificationContextWrapper extends React.Component<{}, NotificationPayload> {
    private socket = new WebSocket('ws://localhost:23167');
    private reconnect: NodeJS.Timeout | null = null;

    constructor(prop: any) {
        super(prop);

        this.state = { notifications: [], pinned: [], count: 0 };

        this.update();

        this.init();
    }

    private update() {
        api.fetch<NotificationPayload>('/notifications', 'get')
            .then((res) => {
                this.setState(() => {
                    return res;
                });
            })
            .catch((e) => {
                console.log(e);
            });
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
            case 'espresso:notification-dismissed':
            case 'espresso:notification-pinned':
            case 'espresso:notification-unpinned':
                this.update();
        }
    }

    public render() {
        return <NotificationContext.Provider value={this.state}>{this.props.children}</NotificationContext.Provider>;
    }
}
export default NotificationContext;
