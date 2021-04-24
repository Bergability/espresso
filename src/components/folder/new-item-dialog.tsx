// Libraries
import React, { useState } from 'react';

// Components
import {
    Button,
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

// Types
import { Item } from '@typings/items';

interface State {
    name: string;
    type: Item['type'];
}

interface Props {
    open: boolean;
    onNewItem: (name: string, type: Item['type']) => void;
    onClose: () => void;
}

const NewItemDialog: React.FC<Props> = ({ open, onClose, onNewItem }) => {
    const [state, updateState] = useState<State>({ name: '', type: 'action-set' });

    const onNameChange = (name: string) => {
        updateState({ ...state, name });
    };

    const onTypeChange = (type: Item['type']) => {
        updateState({ ...state, type });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <form>
                <DialogTitle>
                    <Typography>New item</Typography>
                </DialogTitle>

                <DialogContent>
                    <FormControl variant="outlined" fullWidth>
                        <TextField
                            variant="outlined"
                            label="Item name"
                            value={state.name}
                            onChange={(e) => {
                                onNameChange(e.target.value);
                            }}
                            autoFocus
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="espresso-new-item-form-type">Item type</InputLabel>

                        <Select
                            value={state.type}
                            label="Item Type"
                            labelId="espresso-new-item-form-type"
                            onChange={(e) => {
                                onTypeChange(e.target.value as Item['type']);
                            }}
                        >
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            onNewItem(state.name, state.type);
                        }}
                    >
                        Add item
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NewItemDialog;
