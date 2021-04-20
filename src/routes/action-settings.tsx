// Libraries
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import EspressoAppBar from '@components/app-bar';

// Utilities
import api from '@utilities/api';

// Types
import { GetActionPayload } from '@typings/api';
import { Action } from '@typings/espresso';
import { RouteComponentProps } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import EspressoForm from '@components/form/form';
import { Input } from '@typings/inputs';

interface Params {
    id: string;
    actionId: string;
}

const ActionSettingsRoute: React.FC<RouteComponentProps<Params>> = (props) => {
    const [state, updateState] = useState<GetActionPayload | null>(null);
    const { actionId } = props.match.params;

    useEffect(() => {
        api.fetch<GetActionPayload>(`/actions/${actionId}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const onChange = (key: keyof Object, value: any) => {
        updateState({
            ...state,
            action: {
                ...state.action,
                settings: {
                    ...state.action.settings,
                    [key]: value,
                },
            },
        });
    };

    const onSave = (data: Action<Object>['settings']) => {
        api.fetch(
            `/actions/${actionId}`,
            'put',
            JSON.stringify({
                ...state.action,
                settings: data,
            })
        ).catch((e) => {
            console.log(e);
        });
    };

    return (
        <>
            <EspressoAppBar crumbs={state.crumbs} />
            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<Action<Object>['settings']>
                        inputs={state.schema.settings as Input<Action<Object>['settings']>[]}
                        data={state.action.settings}
                        onChange={onChange}
                        onSave={onSave}
                    />
                </Paper>
            </div>
        </>
    );
};

export default withRouter(ActionSettingsRoute);
