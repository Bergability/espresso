import React from 'react';
import { AppBar, Breadcrumbs, IconButton, LinearProgress, Toolbar, Typography } from '@material-ui/core';

import './app-bar.scss';

interface Crumb {
    text: string;
    link: string;
}

interface Props {
    crumbs: Crumb[];
    loading?: boolean;
}

const EspressoAppBar: React.FC<Props> = ({ crumbs, loading, children }) => {
    const CrumbDisplay: React.FC = () => {
        if (crumbs.length === 0 || loading) return <Typography>&nbsp;</Typography>;

        return (
            <Breadcrumbs className="espresso-app-bar-crumbs">
                {crumbs.map(({ text, link }, index) => {
                    return (
                        <Typography key={index} color="textPrimary">
                            {text}
                        </Typography>
                    );
                })}
            </Breadcrumbs>
        );
    };

    return (
        <>
            <AppBar position="sticky" color="default">
                <Toolbar className="espresso-app-bar">
                    <CrumbDisplay />
                    {children}
                </Toolbar>
            </AppBar>
            {loading ? <LinearProgress /> : null}
        </>
    );
};

export default EspressoAppBar;
