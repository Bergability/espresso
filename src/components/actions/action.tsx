// Libraries
import React, { useState } from 'react';

// Components
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Icon, Menu, MenuItem, Typography, ListItemSecondaryAction, makeStyles, createStyles } from '@material-ui/core';

// Styles
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
import { Action, ActionSchema } from '@typings/espresso';

export interface MousePosition {
    x: null | number;
    y: null | number;
}

interface Props {
    index: number;
    set: string;
    action: Action;
    schema: ActionSchema;
    isFirst?: boolean;
    isLast?: boolean;
    onDelete: (actionId: string) => void;
    onMove: (actionId: string, index: number) => void;
}

const ActionDisplay: React.FC<Props> = ({ set, index, action, schema, isFirst, isLast, onDelete, onMove }) => {
    const classes = styles();
    const [mousePosition, updateMousePosition] = useState<MousePosition>({ x: null, y: null });

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
                {isFirst ? null : (
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => {
                            updateMousePosition({ x: null, y: null });
                            onMove(action.id, index - 1);
                        }}
                    >
                        <Typography>Move Up</Typography>
                        <ListItemSecondaryAction className={classes.menuIcon}>
                            <Icon>arrow_upward</Icon>
                        </ListItemSecondaryAction>
                    </MenuItem>
                )}

                {isLast ? null : (
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => {
                            updateMousePosition({ x: null, y: null });
                            onMove(action.id, index + 1);
                        }}
                    >
                        <Typography>Move Down</Typography>
                        <ListItemSecondaryAction className={classes.menuIcon}>
                            <Icon>arrow_downward</Icon>
                        </ListItemSecondaryAction>
                    </MenuItem>
                )}

                <MenuItem className={classes.menuItem}>
                    <Typography>Settings</Typography>
                    <ListItemSecondaryAction className={classes.menuIcon}>
                        <Icon>settings</Icon>
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem
                    className={classes.menuItem}
                    onClick={() => {
                        onDelete(action.id);
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
        <>
            <ButtonGroup variant="outlined" className="espresso-action-list-button-group" fullWidth>
                <Button
                    component={Link}
                    to={`/action-set/${set}/action/${action.id}`}
                    style={{ textTransform: 'none', textAlign: 'left', padding: '0' }}
                    variant="outlined"
                    onContextMenu={onContextMenu}
                    fullWidth
                >
                    <div className="espresso-action-list-action-button">
                        <Typography variant="caption" style={{ opacity: 0.5, fontSize: '.8em' }}>
                            {schema.provider}: {schema.catigory}
                        </Typography>
                        <Typography style={{ fontWeight: 'bold' }}>{schema.name}</Typography>
                        <Typography style={{ fontSize: '.95em' }}>Something will go here eventually.</Typography>
                    </div>
                </Button>

                {schema.children ? (
                    <Button variant="outlined" className={classes.childButton} component={Link} to={`/action-set/${set}/${action.id}`}>
                        <Icon>chevron_right</Icon>
                    </Button>
                ) : null}
            </ButtonGroup>
            <ContextMenu />
        </>
    );
};

export default ActionDisplay;
