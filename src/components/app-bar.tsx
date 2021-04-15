import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Breadcrumbs, IconButton, LinearProgress, makeStyles, Toolbar, Typography } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    crumb: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
    },
}));

import './app-bar.scss';

export interface Crumb {
    text: string;
    link: string;
}

interface Props {
    crumbs: Crumb[];
    loading?: boolean;
}

const EspressoAppBar: React.FC<Props> = ({ crumbs, loading, children }) => {
    const classes = styles();

    const CrumbDisplay: React.FC = () => {
        if (crumbs.length === 0 || loading) return <Typography>&nbsp;</Typography>;

        return (
            <Breadcrumbs className="espresso-app-bar-crumbs">
                {crumbs.map(({ text, link }, index) => {
                    if (index === crumbs.length - 1)
                        return (
                            <Typography key={index} color="textPrimary">
                                {text}
                            </Typography>
                        );

                    return (
                        <Typography key={index} color="textPrimary" component={Link} to={link} className={classes.crumb}>
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
