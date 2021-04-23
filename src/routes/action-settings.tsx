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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import EspressoForm from '@components/form/form';
import { Input } from '@typings/inputs';
import { copyToClipboard } from '@utilities';

interface Params {
    id: string;
    actionId: string;
}

const ActionSettingsRoute: React.FC<RouteComponentProps<Params>> = (props) => {
    const [open, updateOpen] = useState(false);
    const [state, updateState] = useState<GetActionPayload | null>(null);
    const { actionId } = props.match.params;

    useEffect(() => {
        api.fetch<GetActionPayload>(`/actions/${actionId}`, 'get')
            .then((res) => {
                console.log(res);

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

    const onOpen = () => {
        updateOpen(true);
    };

    const onClose = () => {
        updateOpen(false);
    };

    return (
        <>
            <EspressoAppBar crumbs={state.crumbs}>
                {state.variables.length > 0 ? (
                    <Tooltip title="Variables" placement="bottom">
                        <IconButton onClick={onOpen}>
                            <Icon>code</Icon>
                        </IconButton>
                    </Tooltip>
                ) : null}
            </EspressoAppBar>
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

            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle>Variables</DialogTitle>
                <DialogContent dividers>
                    {state.variables.map((variable) => (
                        <Button
                            key={variable.name}
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                copyToClipboard(`[${variable.name}]`);
                                onClose();
                            }}
                            style={{
                                textTransform: 'none',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                marginBottom: 10,
                                padding: 10,
                            }}
                        >
                            <div>
                                <Typography>[{variable.name}]</Typography>
                                <Typography variant="caption">{variable.description}</Typography>
                            </div>
                        </Button>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withRouter(ActionSettingsRoute);
