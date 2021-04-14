import React from 'react';
import { AppBar, Breadcrumbs, Typography } from '@material-ui/core';

import './app-bar.scss';

interface Crumb {
    text: string;
    link: string;
}

interface Props {
    crumbs: Crumb[];
}

const EspressoAppBar: React.FC<Props> = ({ crumbs }) => {
    return (
        <AppBar position="sticky" color="default" className="espresso-app-bar">
            <Breadcrumbs>
                {crumbs.map(({ text, link }, index) => {
                    return <Typography key={index}>{text}</Typography>;
                })}
            </Breadcrumbs>
        </AppBar>
    );
};

export default EspressoAppBar;
