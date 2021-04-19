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

    const fetchActions = () => {
        api.fetch<GetPutActionSetPayload>(`/action-set/${id}${actionId ? `?actionId=${actionId}` : ''}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        fetchActions();
    }, [id, actionId]);

    if (state === null) return null;

    const currentAction = state.actions.find((a) => a.id === actionId);

    const onNewActionClick = (slug: string) => {
        const body: NewActionRequestPayload = {
            slug,
            set: id,
            actionId,
        };

        api.fetch<PostActionPayload>('/actions', 'post', JSON.stringify(body))
            .then((res) => {
                fetchActions();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onActionMove = (aId: string, index: number) => {
        api.fetch(`/actions/${aId}/move?index=${index}`, 'put')
            .then(() => {
                fetchActions();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onActionDelete = (aId: string) => {
        api.fetch(`/actions/${aId}`, 'delete')
            .then(() => {
                fetchActions();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <EspressoAppBar crumbs={state.crumbs} loading={state === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>

            <div className="espresso-actions-editor">
                <div className="espresso-actions-editor-list">
                    {(currentAction ? currentAction.actions : state.set.actions).map((aId, index) => {
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
                                onMove={onActionMove}
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
