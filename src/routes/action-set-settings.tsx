// Libraries
import React, { useEffect, useState } from 'react';

// Components
import { Paper } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import EspressoForm from '@components/form/form';

// Utilities
import api from '@utilities/api';

// Types
import { Input } from '@typings/inputs';
import { Crumb } from '@components/app-bar';
import { ActionSet } from '@typings/items';
import { TriggerSchema } from '@typings/espresso';
import { GetPutActionSetPayload } from '@typings/api';

interface Props {
    id: string;
}

const ActionSetSettingsRoute: React.FC<Props> = ({ id }) => {
    const [state, updateState] = useState<GetPutActionSetPayload | null>(null);

    useEffect(() => {
        api.fetch<GetPutActionSetPayload>(`/action-set/${id}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log();
            });
    }, []);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const inputs: Input<ActionSet>[] = [
        {
            type: 'toggle',
            key: 'active',
            default: true,
            label: 'Enabled',
            helper: 'If the action set will run when triggered.',
        },
        {
            type: 'text',
            default: '',
            key: 'name',
            label: 'Name',
        },
        {
            type: 'select',
            key: 'triggers',
            label: 'Triggers',
            default: [],
            multiple: true,
            helper: 'The methods that will trigger this action set.',
            options: 'espresso:triggers',
        },
        {
            type: 'button',
            label: 'Edit triggers',
            link: `/action-set/${id}/settings/triggers`,
            variant: 'outlined',
        },
    ];

    const onChange = (key: keyof ActionSet, value: any) => {
        updateState({
            ...state,
            set: {
                ...state.set,
                [key]: value,
            },
        });
    };

    const onSave = (data: ActionSet) => {
        api.fetch(`/action-set/${id}`, 'put', JSON.stringify(data)).catch((e) => {
            console.log(e);
        });
    };

    state.crumbs[state.crumbs.length - 1].text = state.set.name;

    return (
        <>
            <EspressoAppBar crumbs={[...state.crumbs, { text: 'Settings', link: `/action-set/${id}/settings` }]} />
            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<ActionSet> inputs={inputs} data={state.set} onChange={onChange} onSave={onSave} variant="outlined" />
                </Paper>
            </div>
        </>
    );
};

export default ActionSetSettingsRoute;
