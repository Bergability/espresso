// Libraries
import React, { useState } from 'react';

// Components
import { Button, Icon, Typography, MenuItem, Menu, ListItemSecondaryAction, makeStyles, createStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = makeStyles((theme) =>
    createStyles({
        menuItem: {
            minWidth: '200px',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
        },
        menuIcon: {
            height: '24px',
            pointerEvents: 'none',
        },
        childButton: {
            color: theme.palette.text.primary,
        },
    })
);

// Types
import { Item } from '@typings/items';

interface MousePosition {
    x: null | number;
    y: null | number;
}

interface Props {
    item: Item;
}

const ItemDisplay: React.FC<Props> = ({ item }) => {
    const classes = styles();
    const [mousePosition, updateMousePosition] = useState<MousePosition>({ x: null, y: null });
    let link: string;

    switch (item.type) {
        case 'action-set':
            link = `/action-set/${item.id}`;
            break;

        case 'folder':
            link = `/${item.id}`;
            break;
    }

    const onContextMenu = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        updateMousePosition({
            x: e.clientX - 2,
            y: e.clientY - 4,
        });
    };

    const ContextMenu: React.FC = () => {
        return (
            <Menu
                onClose={() => {
                    updateMousePosition({ x: null, y: null });
                }}
                open={mousePosition.x !== null}
                anchorReference="anchorPosition"
                anchorPosition={mousePosition.y !== null && mousePosition.x !== null ? { top: mousePosition.y, left: mousePosition.x } : undefined}
            >
                {/* TODO Make this work for folders when you add folders dumb dumb */}
                <MenuItem className={classes.menuItem} component={Link} to={`/action-set/${item.id}/settings`}>
                    <Typography>Settings</Typography>
                    <ListItemSecondaryAction className={classes.menuIcon}>
                        <Icon>settings</Icon>
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem
                    className={classes.menuItem}
                    onClick={() => {
                        // onDelete(action.id);
                    }}
                >
                    <Typography color="error">Delete</Typography>
                    <ListItemSecondaryAction className={classes.menuIcon}>
                        <Icon color="error">delete</Icon>
                    </ListItemSecondaryAction>
                </MenuItem>
            </Menu>
        );
    };

    return (
        <React.Fragment key={item.id}>
            <Button
                key={item.id}
                variant="outlined"
                className={`espresso-item-button ${item.type}`}
                component={Link}
                to={link}
                onContextMenu={onContextMenu}
            >
                {item.name}
            </Button>
            <ContextMenu />
        </React.Fragment>
    );
};

export default ItemDisplay;
