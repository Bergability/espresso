// Libraries
import React from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';

// Components
import { Switch, Route } from 'react-router-dom';

// Routes
import ActionSetEditorRoute from '@routes/action-set-editor';
import ActionSetSettingsRoute from '@routes/action-set-settings';
import ActionSetTriggersRoute from '@routes/action-set-triggers';

// Utilities
import api from '@utilities/api';

// Types
import { ActionSet } from '@typings/items';
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
    id: string;
}

type State = ActionSet | null;

const ActionSetRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const id = props.match.params.id;
    const match = useRouteMatch();

    // Show just the loading app bar if we are still loading
    return (
        <Switch>
            {/* Main set editor route */}
            <Route path={`${match.path}`} exact>
                <ActionSetEditorRoute id={id} />
            </Route>

            {/* Settings route */}
            <Route path={`${match.path}/settings`} exact>
                <ActionSetSettingsRoute id={id} />
            </Route>

            {/* Settings route */}
            <Route path={`${match.path}/settings/triggers`} exact>
                <ActionSetTriggersRoute id={id} />
            </Route>
        </Switch>
    );
};

export default withRouter(ActionSetRoute);
