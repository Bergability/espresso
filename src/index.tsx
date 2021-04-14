import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline, ThemeProvider, createMuiTheme, Theme, AppBar } from '@material-ui/core';
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
                <AppBar position="sticky" color="default">
                    <p>test</p>
                </AppBar>
            </div>
        </ThemeProvider>
    </>,
    document.getElementById('mount')
);
