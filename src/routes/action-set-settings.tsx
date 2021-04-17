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
        // {
        //     type: 'chips',
        //     key: 'triggers',
        //     label: 'Command aliases',
        //     helper: 'Things that do things... they are chips.',
        //     emptyText: 'No command aliases',
        //     duplicates: false,
        //     textTransform: 'lowercase',
        // },
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
            options: 'espresso:triggers',
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
                <EspressoForm<ActionSet> inputs={inputs} data={item} onChange={onChange} onSave={onSave} variant="outlined" />
                <Paper className="padded" style={{ marginTop: '20px' }}>
                    <pre>{JSON.stringify(item, null, 4)}</pre>
                </Paper>
            </div>
        </>
    );
};

export default ActionSetSettingsRoute;
