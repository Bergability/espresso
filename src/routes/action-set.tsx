// Libraries
import React from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';

// Components
import { Switch, Route } from 'react-router-dom';

// Routes
import ActionSetEditorRoute from '@routes/action-set-editor';
import ActionSetSettingsRoute from '@routes/action-set-settings';
import ActionSetTriggersRoute from '@routes/action-set-triggers';

// Types
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
    id: string;
}

const ActionSetRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const id = props.match.params.id;
    const match = useRouteMatch();

    // Show just the loading app bar if we are still loading
    return (
        <Switch>
            {/* Main set editor route */}
            <Route path={`${match.path}`} exact>
                <ActionSetEditorRoute />
            </Route>

            {/* Settings route */}
            <Route path={`${match.path}/settings`} exact>
                <ActionSetSettingsRoute id={id} />
            </Route>

            {/* Settings route */}
            <Route path={`${match.path}/settings/triggers`} exact>
                <ActionSetTriggersRoute id={id} />
            </Route>

            {/* Nested action editor */}
            <Route path={`${match.path}/:actionId`} exact>
                <ActionSetEditorRoute />
            </Route>

            {/* Action settings editor */}
            <Route path={`${match.path}/action/:actionId`} exact>
                <p>Action settings</p>
                <ActionSetEditorRoute />
            </Route>
        </Switch>
    );
};

export default withRouter(ActionSetRoute);
