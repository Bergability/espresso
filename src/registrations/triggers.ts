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

interface TwtichChatMessageContains {
    strings: string[];
}

const TwtichChatMessageContainsSettings: Input<TwtichChatMessageContains>[] = [
    {
        type: 'chips',
        key: 'strings',
        default: [],
        label: 'Keywords',
        textTransform: 'lowercase',
        duplicates: false,
        emptyText: 'No keywords set',
    },
];

espresso.triggers.register({
    slug: 'twitch-chat-message-contains',
    name: 'Chat message contains',
    provider: 'Twitch',
    catigory: 'Twitch chat',
    settings: TwtichChatMessageContainsSettings,
});

interface TwtichChatCommand {
    aliases: string[];
}

const ChatCommandSettings: Input<TwtichChatCommand>[] = [
    {
        type: 'chips',
        key: 'aliases',
        default: [],
        label: 'Command aliases',
        emptyText: 'No command aliases',
        textTransform: 'lowercase',
        duplicates: false,
    },
];

espresso.triggers.register({
    slug: 'twitch-chat-command',
    name: 'Twitch chat command',
    provider: 'Twitch',
    catigory: 'Twitch chat',
    settings: ChatCommandSettings,
});
