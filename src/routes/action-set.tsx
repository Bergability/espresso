import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

import { ActionSet, Item } from '@typings/items';
import EspressoAppBar, { Crumb } from '@components/app-bar';
import api from 'src/api';
import { IconButton, Icon } from '@material-ui/core';

interface RouteParams {
    id: string;
}

interface State {
    item: Item | null;
    crumbs: Crumb[];
}

const defaultState: State = {
    item: null,
    crumbs: [{ text: 'Home', link: '/' }],
};

const ActionSetRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const id = props.match.params.id;
    const [state, updateState] = useState<State>(defaultState);

    useEffect(() => {
        api.get<ActionSet>(`/items/${id}`)
            .then((res) => {
                const newState = { ...state };
                newState.item = res;
                if (res !== null) newState.crumbs = [...newState.crumbs, { text: res.name, link: `/action-set/${id}` }];
                updateState(newState);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    // Show just the loading app bar if we are still loading
    return (
        <>
            <EspressoAppBar crumbs={state.crumbs} loading={state.item === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>
        </>
    );
};

export default withRouter(ActionSetRoute);
