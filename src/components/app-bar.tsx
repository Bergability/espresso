// Libraries
import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

// Components
import { Link } from 'react-router-dom';
import {
    AppBar,
    Breadcrumbs,
    LinearProgress,
    makeStyles,
    Toolbar,
    Typography,
    Link as MaterialLink,
    Drawer,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';

// Styles
import './app-bar.scss';
import { Item } from '@typings/items';
import api from '@utilities/api';

const useStyles = makeStyles((theme) => ({
    current: {
        color: 'white',
        cursor: 'default',
    },
    crumb: {
        color: theme.palette.primary.main,
    },
    dragOver: {
        color: theme.palette.primary.main,
    },
}));

// Types
export interface Crumb {
    text: string;
    link: string;
    type: Item['type'] | 'action' | 'link';
    id?: string | null;
}

interface Props {
    crumbs: Crumb[];
    loading?: boolean;
    refresh?: () => void;
}

const EspressoAppBar: React.FC<Props> = ({ crumbs, loading, children, refresh }) => {
    const [drawerState, updateDrawerState] = useState(false);

    const CrumbDisplay: React.FC = () => {
        if (crumbs.length === 0 || loading) return <Typography>&nbsp;</Typography>;

        return (
            <Breadcrumbs className="espresso-app-bar-crumbs" maxItems={5} itemsBeforeCollapse={2} itemsAfterCollapse={3}>
                {crumbs.map((crumb, index) => {
                    return <Crumb key={index} crumb={crumb} isLast={index === crumbs.length - 1} refresh={refresh} />;
                })}
            </Breadcrumbs>
        );
    };

    return (
        <>
            <AppBar position="sticky" color="default">
                <Toolbar className="espresso-app-bar">
                    <IconButton
                        onClick={() => {
                            updateDrawerState(true);
                        }}
                        style={{ marginRight: 20 }}
                    >
                        <Icon>menu</Icon>
                    </IconButton>
                    <CrumbDisplay />
                    {children}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={drawerState}
                onClose={() => {
                    updateDrawerState(false);
                }}
            >
                <List style={{ width: 250 }}>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <Icon>folder</Icon>
                        </ListItemIcon>
                        <ListItemText primary="My Items" />
                    </ListItem>

                    <ListItem button component={Link} to="/plugins">
                        <ListItemIcon>
                            <Icon>power</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Plugins" />
                    </ListItem>

                    {/* <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <Icon>settings</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem> */}
                </List>
            </Drawer>
            {loading ? <LinearProgress /> : null}
        </>
    );
};

interface CrumbProp {
    isLast: boolean;
    crumb: Crumb;
    refresh?: () => void;
}

const Crumb: React.FC<CrumbProp> = ({ crumb, isLast, refresh }) => {
    const classes = useStyles();
    const ref = useRef(null);

    const getAccepted = (type: Crumb['type']): string | string[] => {
        switch (type) {
            case 'folder':
                return 'item';

            case 'action':
                return 'action';

            case 'action-set':
                return 'action';
            default:
                return [];
        }
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: getAccepted(crumb.type),
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
        }),
        drop: (e: { id: string }) => {
            switch (crumb.type) {
                case 'folder':
                    api.fetch(`/items/${e.id}/move`, 'put', JSON.stringify({ to: crumb.id })).catch((e) => {
                        console.log(e);
                    });
                    if (refresh) refresh();
                    break;
            }
        },
    }));

    drop(ref);

    if (isLast)
        return (
            <Typography color="textPrimary" className={classes.current}>
                {crumb.text}
            </Typography>
        );

    return (
        <MaterialLink ref={ref} color="textPrimary" component={Link} to={crumb.link} className={`${isOver ? classes.dragOver : ''} ${classes.crumb}`}>
            {crumb.text}
        </MaterialLink>
    );
};

export default EspressoAppBar;
