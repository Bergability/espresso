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
import { ActionSet } from '@typings/items';
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
    id: string;
}

type State = ActionSet | null;

interface ContextUpdate {
    update: (update: State) => void;
}

// @ts-ignore
export const ActionSetContext = createContext<{ item: State } & ContextUpdate>(null);

const ActionSetRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const id = props.match.params.id;
    const match = useRouteMatch();
    const [state, updateState] = useState<State>(null);

    useEffect(() => {
        api.get<ActionSet>(`/items/${id}`)
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    // Show just the loading app bar if we are still loading
    return (
        <ActionSetContext.Provider value={{ item: state, update: updateState }}>
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
