// Libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import { Typography, Button } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import api from '@utilities/api';

const NotFoundRoute: React.FC = () => {
    return (
        <>
            <EspressoAppBar
                crumbs={[
                    { text: 'My items', link: '/', type: 'link' },
                    { text: 'Settings', link: '', type: 'link' },
                ]}
            />

            <div className="route-wrapper">
                <Typography>404</Typography>
                <Typography>Woops. Looks like you are lost.</Typography>
                <Button variant="outlined" color="primary" component={Link} to="/">
                    Take me home
                </Button>
            </div>
        </>
    );
};

export default NotFoundRoute;
