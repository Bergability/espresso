import { Input } from '@typings/inputs';
import espresso from '../core/espresso';

espresso.triggers.register({
    slug: 'generic-trigger',
    name: 'Generic trigger',
    provider: 'Espresso',
    catigory: 'Utility',
});

espresso.triggers.register({
    slug: 'twitch-chat-message',
    name: 'Chat message',
    provider: 'Twitch',
    catigory: 'Twitch chat',
});

espresso.triggers.register({
    slug: 'twitch-chat-message-contains',
    name: 'Chat message contains',
    provider: 'Twitch',
    catigory: 'Twitch chat',
});

interface TwtichChatCommand {
    aliases: string[];
}

const ChatCommandSettings: Input<TwtichChatCommand>[] = [
    {
        type: 'chips',
        key: 'aliases',
        label: 'Command aliases',
        emptyText: 'No command aliases',
    },
];

espresso.triggers.register({
    slug: 'twitch-chat-command',
    name: 'Twitch chat command',
    provider: 'Twitch',
    catigory: 'Twitch chat',
    settings: ChatCommandSettings,
});
