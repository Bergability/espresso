// Libraries
import React, { useContext } from 'react';

// Components
import { Paper } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import EspressoForm from '@components/form/form';

// Contexts
import { ActionSetContext } from './action-set';

// Utilities
import api from '@utilities/api';

// Types
import { Input } from '@typings/inputs';
import { Crumb } from '@components/app-bar';
import { ActionSet } from '@typings/items';

interface Props {
    id: string;
}

const ActionSetSettingsRoute: React.FC<Props> = ({ id }) => {
    const { item, update } = useContext(ActionSetContext);

    if (item === null) return null;

    const crumbs: Crumb[] = [
        { text: 'Home', link: `/` },
        { text: item.name, link: `/action-set/${id}` },
        { text: 'Settings', link: `/action-set/${id}/settings` },
    ];

    const inputs: Input<ActionSet>[] = [
        {
            type: 'toggle',
            key: 'active',
            label: 'Enabled',
            helper: 'If the action set will run when triggered.',
        },
        {
            type: 'text',
            key: 'name',
            label: 'Name',
        },
        {
            type: 'select',
            key: 'triggers',
            label: 'Triggers',
            multiple: true,
            helper: 'The methods that will trigger this action set.',
            options: [
                { text: 'Generic trigger', value: 'generic-trigger' },
                { text: 'Twitch chat message', value: 'twitch-chat-message' },
                { text: 'Twitch chat command', value: 'twitch-chat-command' },
            ],
        },
    ];

    const onChange = (key: keyof ActionSet, value: any) => {
        update({
            ...item,
            [key]: value,
        });
    };

    const onSave = (data: ActionSet) => {
        api.put(`/items/${id}`, JSON.stringify(data));
    };

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={item === null} />
            <div className="route-wrapper">
                <Paper className="padded" style={{ marginBottom: '20px' }}>
                    <pre>{JSON.stringify(item, null, 4)}</pre>
                </Paper>
                <EspressoForm<ActionSet> inputs={inputs} data={item} onChange={onChange} onSave={onSave} variant="outlined" />
            </div>
        </>
    );
};

export default ActionSetSettingsRoute;
