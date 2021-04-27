// Libraries
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

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
        dragging: {
            backgroundColor: theme.palette.background.default,
            // borderColor: theme.palette.background.default,
            color: 'transparent',
            transition: 'none',
            // opacity: '.5',
        },
        draggingIcon: {
            display: 'none',
        },
        dragOver: {
            borderColor: theme.palette.primary.main,
        },
    })
);

// Types
import { Item } from '@typings/items';
import api from '@utilities/api';

interface MousePosition {
    x: null | number;
    y: null | number;
}

interface Props {
    item: Item;
    refresh: () => void;
}

const ItemDisplay: React.FC<Props> = ({ item, refresh }) => {
    const ref = useRef(null);
    const classes = styles();
    const [mousePosition, updateMousePosition] = useState<MousePosition>({ x: null, y: null });
    const [disableRipple, updateRipple] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { id: item.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: item.type === 'folder' ? 'item' : [],
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
        }),
        drop: (e: { id: string }) => {
            const itemId = e.id as string;

            api.fetch(`/items/${itemId}/move`, 'put', JSON.stringify({ to: item.id }))
                .then(() => {
                    refresh();
                })
                .catch((e) => {
                    console.log(e);
                });
        },
    }));

    drop(drag(ref));

    let link: string;
    let settingsLink: string;

    switch (item.type) {
        case 'action-set':
            link = `/action-set/${item.id}`;
            settingsLink = `/action-set/${item.id}/settings`;
            break;

        case 'folder':
            link = `/${item.id}`;
            settingsLink = `/${item.id}/settings`;
            break;

        case 'list':
            link = `/list/${item.id}`;
            settingsLink = `/list/${item.id}`;
            break;
    }

    const onContextMenu = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        updateMousePosition({
            x: e.clientX - 2,
            y: e.clientY - 4,
        });
    };

    const onDelete = () => {
        api.fetch(`/items/${item.id}`, 'delete')
            .then(() => {
                refresh();
            })
            .catch((e) => {
                console.log(e);
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
                <MenuItem className={classes.menuItem} component={Link} to={settingsLink}>
                    <Typography>Settings</Typography>
                    <ListItemSecondaryAction className={classes.menuIcon}>
                        <Icon>settings</Icon>
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem className={classes.menuItem} onClick={onDelete}>
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
                ref={ref}
                onDragStart={() => {
                    updateRipple(true);
                }}
                onDragEnd={() => {
                    updateRipple(false);
                }}
                disableRipple={disableRipple}
                key={item.id}
                variant="outlined"
                className={`${item.type} ${isDragging ? classes.dragging : ''} ${isOver ? classes.dragOver : ''}`}
                component={Link}
                to={link}
                onContextMenu={onContextMenu}
            >
                {item.type === 'folder' ? (
                    <Icon style={{ marginRight: '10px', color: item.color }} className={isDragging ? classes.draggingIcon : ''}>
                        folder
                    </Icon>
                ) : null}
                <span>{item.name}</span>
            </Button>
            <ContextMenu />
        </React.Fragment>
    );
};

export default ItemDisplay;
