// Libraries
import React from 'react';

// Components
import { Link } from 'react-router-dom';
import { AppBar, Breadcrumbs, LinearProgress, makeStyles, Toolbar, Typography, Link as MaterialLink } from '@material-ui/core';

// Styles
import './app-bar.scss';

const useStyles = makeStyles((theme) => ({
    crumb: {
        color: theme.palette.primary.main,
    },
    current: {
        cursor: 'default',
    },
}));

// Types
export interface Crumb {
    text: string;
    link: string;
}

interface Props {
    crumbs: Crumb[];
    loading?: boolean;
}

const EspressoAppBar: React.FC<Props> = ({ crumbs, loading, children }) => {
    const classes = useStyles();

    const CrumbDisplay: React.FC = () => {
        if (crumbs.length === 0 || loading) return <Typography>&nbsp;</Typography>;

        return (
            <Breadcrumbs className="espresso-app-bar-crumbs" maxItems={5} itemsBeforeCollapse={2} itemsAfterCollapse={3}>
                {crumbs.map(({ text, link }, index) => {
                    if (index === crumbs.length - 1)
                        return (
                            <Typography key={index} color="textPrimary">
                                {text}
                            </Typography>
                        );

                    return (
                        <MaterialLink key={index} color="textPrimary" component={Link} to={link} className={classes.crumb}>
                            {text}
                        </MaterialLink>
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
