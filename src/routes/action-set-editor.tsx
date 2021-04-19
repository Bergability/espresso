// Libraries
import React, { useContext, useEffect, useState } from 'react';

// Components
import { Link, withRouter } from 'react-router-dom';
import { Button, Icon, IconButton, Paper } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import ActionComponent from '@components/actions/action';

// Contexts
import ActionSchemaContext from '../contexts/action-schemas';

// Utilities
import api from '@utilities/api';

// Styles
import './action-set-editor.scss';

// Types
import { Crumb } from '@components/app-bar';
import { GetPutActionSetPayload, NewActionRequestPayload, PostActionPayload } from '@typings/api';
import { RouteComponentProps } from 'react-router-dom';

interface Params {
    id: string;
    actionId?: string;
}

const ActionSetEditorRoute: React.FC<RouteComponentProps<Params>> = (props) => {
    const actionSchemas = useContext(ActionSchemaContext);
    const [state, updateState] = useState<GetPutActionSetPayload | null>(null);
    const { id, actionId } = props.match.params;

    useEffect(() => {
        api.fetch<GetPutActionSetPayload>(`/action-set/${id}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (state === null) return null;

    // TODO add these to the API for action sets!
    const crumbs: Crumb[] = [
        { text: 'Home', link: `/` },
        { text: state.set.name, link: `/action-set/${id}` },
    ];

    const onNewActionClick = (slug: string) => {
        const body: NewActionRequestPayload = {
            slug,
            set: id,
        };

        api.fetch<PostActionPayload>('/actions', 'post', JSON.stringify(body))
            .then((res) => {
                updateState({
                    ...state,
                    actions: [...state.actions, res.action],
                    set: { ...state.set, actions: [...state.set.actions, res.id] },
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onActionDelete = (aId: string) => {
        api.fetch(`/actions/${aId}`, 'delete')
            .then(() => {
                updateState({
                    ...state,
                    set: {
                        ...state.set,
                        actions: state.set.actions.filter((i) => i !== aId),
                    },
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={state === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>

            <div className="espresso-actions-editor">
                <div className="espresso-actions-editor-list">
                    {state.set.actions.map((aId, index) => {
                        const action = state.actions.find((a) => a.id === aId);
                        if (!action) return <p key={aId}>Womp, action not found</p>;

                        const schema = actionSchemas.find((a) => a.slug === action.slug);
                        if (!schema) return <p key={aId}>Booo, schema not found</p>;

                        return (
                            <ActionComponent
                                key={action.id}
                                set={id}
                                index={index}
                                action={action}
                                schema={schema}
                                onDelete={onActionDelete}
                                isFirst={index === 0}
                                isLast={state.set.actions.length - 1 === index}
                            />
                        );
                    })}
                </div>

                <Paper className="espresso-actions-editor-new" square>
                    {actionSchemas.map((schema) => (
                        <Button
                            key={schema.slug}
                            variant="outlined"
                            className="espresso-actions-editor-new-button"
                            style={{ textTransform: 'none' }}
                            fullWidth
                            onClick={(e) => {
                                e.preventDefault();
                                onNewActionClick(schema.slug);
                            }}
                        >
                            {schema.name}
                        </Button>
                    ))}
                </Paper>
            </div>
        </>
    );
};

export default withRouter(ActionSetEditorRoute);
