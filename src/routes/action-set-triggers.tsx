// Libraries
import React, { useContext, useEffect, useState } from 'react';

// Components
import { Paper, Typography } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';

// Utilities
import api from '@utilities/api';

// Types
import { Crumb } from '@components/app-bar';
import { TriggerSchema } from '@typings/espresso';
import { ActionSet, ActionSetSetting } from '@typings/items';
import EspressoForm from '@components/form/form';
import { GetPutActionSetPayload, GetActionSetTriggerPayload } from '@typings/api';

interface Props {
    id: string;
}

const ActionSetTriggersRoute: React.FC<Props> = ({ id }) => {
    const [state, updateState] = useState<GetPutActionSetPayload | null>(null);

    useEffect(() => {
        api.fetch<GetPutActionSetPayload>(`/action-set/${id}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const crumbs: Crumb[] = [
        ...state.crumbs,
        { text: 'Settings', link: `/action-set/${id}/settings`, type: 'link' },
        { text: 'Triggers', link: `/action-set/${id}/settings/triggers`, type: 'link' },
    ];

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={state === null} />

            <div className="route-wrapper">
                {state.set.triggers.map((trigger) => (
                    <TriggerForm key={trigger} slug={trigger} id={id} />
                ))}
            </div>
        </>
    );
};

interface TriggerFormProps {
    id: string;
    slug: string;
}

// interface Props<Data extends Object> {
//     inputs: Input<Data>[];
//     data: Data;
//     onSettingChange: (key: keyof Data, value: any) => void;
//     onSave: (data: Data) => void;
//     saveDelay?: number;
//     variant?: 'filled' | 'outlined' | 'standard';
// }

const TriggerForm: React.FC<TriggerFormProps> = ({ id, slug }) => {
    const [state, updateState] = useState<GetActionSetTriggerPayload | null>(null);

    useEffect(() => {
        api.fetch<GetActionSetTriggerPayload>(`/action-set/${id}/trigger/${slug}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (!state) return null;
    const { trigger, settings } = state;

    if (settings === null) {
        return (
            <Paper className="padded" style={{ marginBottom: '20px' }}>
                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    {trigger.name}
                </Typography>
                <Typography>No settings for this trigger.</Typography>
            </Paper>
        );
    }

    const onChange = (key: keyof ActionSetSetting, value: any) => {
        updateState({
            ...state,
            settings: {
                ...settings,
                [key]: value,
            },
        });
    };

    const onSave = (data: ActionSetSetting) => {
        api.fetch(`/action-set/${id}/trigger/${slug}`, 'put', JSON.stringify(data)).catch((e) => {
            console.log(e);
        });
    };

    return (
        <Paper className="padded" style={{ marginBottom: '20px' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
                {trigger.name}
            </Typography>
            {trigger.settings ? (
                <EspressoForm<ActionSetSetting> inputs={trigger.settings} data={settings} onChange={onChange} onSave={onSave} />
            ) : null}
        </Paper>
    );
};

export default ActionSetTriggersRoute;
