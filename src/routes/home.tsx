import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    CircularProgress,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    FormControl,
    TextField,
    Select,
    MenuItem,
    InputLabel,
} from '@material-ui/core';

import { Item, ItemType } from '@typings/items';

import AppBar from '@components/app-bar';

import api from '../api';

import './home.scss';

const HomeRoute: React.FC = () => {
    const [items, updateItems] = useState<null | Item[]>(null);
    const [open, updateOpen] = useState<boolean>(false);
    const [newItemState, updateNewItemState] = useState<{ type: ItemType; name: string }>({ type: 'action-set', name: 'Hello World' });

    const getItems = async () => {
        const items = await api.get<Item[]>('/items');
        if (items) updateItems(items);
    };

    const onClick = () => {
        updateOpen(true);
    };

    const onClose = () => {
        updateOpen(false);
    };

    const onItemNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        updateNewItemState({
            ...newItemState,
            name: e.target.value,
        });
    };

    const onItemTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        updateNewItemState({
            ...newItemState,
            type: e.target.value as ItemType,
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (items === null) return;
        const res = (await api.post('/items', JSON.stringify(newItemState))) as Item;
        console.log(res);
        updateItems([...items, res]);
        updateOpen(false);
    };

    useEffect(() => {
        getItems();
    });

    if (items === null)
        return (
            <>
                <AppBar crumbs={[{ text: 'Home', link: '/' }]} />

                <div className="route-wrapper loading-items">
                    <CircularProgress />
                </div>
            </>
        );

    return (
        <>
            <AppBar crumbs={[{ text: 'Home', link: '/' }]} />

            <div className="route-wrapper">
                <Button variant="outlined" onClick={onClick}>
                    New Item
                </Button>

                <div>
                    {items.map((item) => {
                        return (
                            <Button variant="outlined" key={item.id}>
                                {item.name}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <form onSubmit={onSubmit}>
                    <DialogTitle>New Item</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <TextField label="Name" value={newItemState.name} onChange={onItemNameChange} variant="outlined" autoFocus />
                        </FormControl>

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="new-item-type-label">Item type</InputLabel>
                            {/* @ts-ignore */}
                            <Select label="Item type" value={newItemState.type} onChange={onItemTypeChange}>
                                <MenuItem value="action-set">Action Set</MenuItem>
                                <MenuItem value="folder">Folder</MenuItem>
                                <MenuItem value="list">List</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit">
                            Create Item
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default HomeRoute;
