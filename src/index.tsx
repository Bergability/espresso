// Libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createMuiTheme, Theme } from '@material-ui/core';

// Routes
import FolderRoute from '@routes/folder';
import ActionSetRoute from '@routes/action-set';

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
            <div className="app">
                <Router>
                    <Switch>
                        <Route path="/" exact>
                            <FolderRoute />
                        </Route>

                        <Route path="/:id" exact>
                            <FolderRoute />
                        </Route>

                        <Route path="/action-set/:id">
                            <ActionSetRoute />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </ThemeProvider>
    </>,
    document.getElementById('mount')
);
