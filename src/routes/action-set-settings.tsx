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
            label: 'Action set name',
        },
        {
            type: 'section',
            title: 'Cooldown',
            description: [
                'A cooldown limits how often an action set can run. You can define a certain amount of time required before this action set will be allowed to run again.',
            ],
            inputs: [
                {
                    type: 'toggle',
                    key: 'useCooldown',
                    label: 'Use a cooldown',
                    default: false,
                },
                {
                    type: 'number',
                    key: 'cooldown',
                    label: 'Cooldown duration',
                    min: 1,
                    default: 1,
                    conditions: [{ value: 'useCooldown', operator: 'equal', comparison: true }],
                },
                {
                    type: 'select',
                    key: 'cooldownUnit',
                    label: 'Cooldown unit',
                    default: 'seconds',
                    options: [
                        { text: 'Seconds', value: 'seconds' },
                        { text: 'Minutes', value: 'minutes' },
                        { text: 'Hours', value: 'hours' },
                    ],
                    conditions: [{ value: 'useCooldown', operator: 'equal', comparison: true }],
                },
            ],
        },
        {
            type: 'section',
            title: 'Triggers',
            description: [
                'Triggers are what cause an action set to run. You can set multiple triggers.',
                '',
                'Information will be passed from the trigger into the action set via "Variables", however if you have multiple triggers you can only use variables that they all have in common.',
                '',
                'The more triggers you have on an action set, the more generic the actions in that set should be.',
            ],
            inputs: [
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
            ],
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
            <EspressoAppBar crumbs={[...state.crumbs, { text: 'Settings', link: `/action-set/${id}/settings`, type: 'link' }]} />
            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<ActionSet> inputs={inputs} data={state.set} onChange={onChange} onSave={onSave} variant="outlined" />
                </Paper>
            </div>
        </>
    );
};

export default ActionSetSettingsRoute;
