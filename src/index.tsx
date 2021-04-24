// Libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createMuiTheme, Theme } from '@material-ui/core';

// Contexts
import { ActionSchemaContextWrapper } from './contexts/action-schemas';

// Routes
import FolderRoute from '@routes/folder';
import ActionSetRoute from '@routes/action-set';
import FolderSettingsRoute from '@routes/folder-settings';
import ListRoute from '@routes/list';

// Styles
import './main.scss';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';

const theme: Theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: blueGrey[500],
        },
    },
});

ReactDOM.render(
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ActionSchemaContextWrapper>
                <div className="app">
                    <Router>
                        <Switch>
                            <Route path="/" exact>
                                <FolderRoute />
                            </Route>

                            <Route path="/:id" exact>
                                <FolderRoute />
                            </Route>

                            <Route path="/:id/settings" exact>
                                <FolderSettingsRoute />
                            </Route>

                            <Route path="/list/:id" exact>
                                <ListRoute />
                            </Route>

                            <Route path="/action-set/:id">
                                <ActionSetRoute />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </ActionSchemaContextWrapper>
        </ThemeProvider>
    </>,
    document.getElementById('mount')
);
