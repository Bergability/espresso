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
import { EspressoTrigger } from '@typings/espresso';
import { GetPutActionSetPayload } from '@typings/api';

interface Props {
    id: string;
}

const ActionSetSettingsRoute: React.FC<Props> = ({ id }) => {
    const [set, updateSet] = useState<ActionSet | null>(null);
    const [triggers, updateTriggers] = useState<EspressoTrigger[]>([]);

    useEffect(() => {
        api.fetch<EspressoTrigger[]>('/triggers', 'get')
            .then((json) => {
                if (json === null) return;
                updateTriggers(json);
            })
            .catch((e) => {
                console.log(e);
            });

        api.fetch<GetPutActionSetPayload>(`/action-set/${id}`, 'get')
            .then((res) => {
                updateSet(res.set);
            })
            .catch((e) => {
                console.log();
            });
    }, []);

    if (set === null) return null;

    const crumbs: Crumb[] = [
        { text: 'Home', link: `/` },
        { text: set.name, link: `/action-set/${id}` },
        { text: 'Settings', link: `/action-set/${id}/settings` },
    ];

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
        updateSet({
            ...set,
            [key]: value,
        });
    };

    const onSave = (data: ActionSet) => {
        api.fetch(`/action-set/${id}`, 'put', JSON.stringify(data)).catch((e) => {
            console.log(e);
        });
    };

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={set === null} />
            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<ActionSet> inputs={inputs} data={set} onChange={onChange} onSave={onSave} variant="outlined" />
                </Paper>
            </div>
        </>
    );
};

export default ActionSetSettingsRoute;
