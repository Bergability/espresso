// Libraries
import React, { useEffect, useState, createContext } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';

// Components
import { Crumb } from '@components/app-bar';
import { Switch, Route } from 'react-router-dom';

// Routes
import ActionSetSettingsRoute from '@routes/action-set-settings';
import ActionSetEditorRoute from '@routes/action-set-editor';

// Utilities
import api from '@utilities/api';

// Types
import { ActionSet, Item } from '@typings/items';
import { RouteComponentProps } from 'react-router-dom';

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

export const ActionSetContext = createContext<State>(defaultState);

const ActionSetRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const id = props.match.params.id;
    const match = useRouteMatch();
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
        <ActionSetContext.Provider value={state}>
            <Switch>
                {/* Settings route */}
                <Route path={`${match.path}/settings`}>
                    <ActionSetSettingsRoute id={id} />
                </Route>

                {/* Main set editor route */}
                <Route path={`${match.path}`} exact>
                    <ActionSetEditorRoute id={id} />
                </Route>
            </Switch>
        </ActionSetContext.Provider>
    );
};

export default withRouter(ActionSetRoute);
