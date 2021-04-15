import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { CssBaseline, ThemeProvider, createMuiTheme, Theme } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';

import ItemRoute from '@routes/item';

import './main.scss';

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
                            <ItemRoute />
                        </Route>

                        <Route path="/:id" exact>
                            <ItemRoute />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </ThemeProvider>
    </>,
    document.getElementById('mount')
);
