import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Icon,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@material-ui/core';

import { Item } from '@typings/items';
import EspressoAppBar from '@components/app-bar';
import api from '../api';

interface State {
    items: Item[];
    loaded: boolean;
    open: boolean;
    error?: string;
}

interface Props {
    id?: string;
}

const defaultState: State = {
    items: [],
    loaded: false,
    open: false,
};

const FolderRoute: React.FC<Props> = (props) => {
    const [state, updateState] = useState<State>(defaultState);

    useEffect(() => {
        // TODO add parent searching
        api.get<Item[]>('/items')
            .then((items) => {
                if (items !== null) updateState({ ...state, items, loaded: true });
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const onNewItemClick = () => {
        updateState({ ...state, open: true });
    };

    const ItemDisplay: React.FC = () => {
        if (!state.loaded) return null;

        return (
            <>
                {state.items.map((item) => (
                    <Button to={`/${item.id}`} key={item.id} variant="outlined" component={Link} style={{ textTransform: 'none' }}>
                        {item.name}
                    </Button>
                ))}
            </>
        );
    };

    const NewItemDialog: React.FC = () => {
        const onClose = () => {
            updateState({
                ...state,
                open: false,
            });
        };

        return (
            <Dialog open={state.open} onClose={onClose} maxWidth="xs" fullWidth>
                <form>
                    <DialogTitle>
                        <Typography>New item</Typography>
                    </DialogTitle>

                    <DialogContent>
                        <FormControl variant="outlined" fullWidth>
                            <TextField variant="outlined" label="Item name" autoFocus />
                        </FormControl>

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="espresso-new-item-form-type">Item type</InputLabel>

                            <Select value={'action-set'} label="Item Type" labelId="espresso-new-item-form-type">
                                <MenuItem value="action-set">Action Set</MenuItem>
                                <MenuItem value="folder">Folder</MenuItem>
                                <MenuItem value="list">list</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary">
                            Add item
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    };

    return (
        <>
            <EspressoAppBar crumbs={[{ text: 'Home', link: '/' }]} loading={!state.loaded}>
                <IconButton onClick={onNewItemClick}>
                    <Icon>add_box</Icon>
                </IconButton>
            </EspressoAppBar>

            <div className="route-wrapper">
                <ItemDisplay />
            </div>

            <NewItemDialog />
        </>
    );
};

export default FolderRoute;
