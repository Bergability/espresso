// Libraries
import React, { useState } from 'react';

// Components
import { Chip, FormControl, Icon, TextField, IconButton, Typography, FormHelperText } from '@material-ui/core';

// Styles
import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    wrapper: {
        borderRadius: theme.shape.borderRadius,
        '&:focus-within': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

// Types
interface Props {
    inputKey: string;
    label: string;
    value: string[];
    emptyText: string;
    duplicates?: boolean;
    textTransform?: 'uppercase' | 'lowercase';
    helperText?: string;
    onChange: (key: string, value: string[]) => void;
}

interface State {
    inputValue: string;
    error: string | null;
}

const EspressoChipsInput: React.FC<Props> = ({ inputKey, label, value, emptyText, helperText, duplicates, textTransform, onChange }) => {
    const classes = styles();
    const [state, updateState] = useState<State>({ inputValue: '', error: null });
    const { inputValue, error } = state;

    // Defaulter
    if (value === undefined) value = [];

    const onNewChip = () => {
        if (inputValue === '') {
            updateState({
                ...state,
                error: 'Empty values are not allowed.',
            });
            return;
        }

        if (duplicates === false && value.includes(inputValue)) {
            updateState({
                ...state,
                error: 'Duplicate values are not allowed.',
            });
            return;
        }

        onChange(inputKey, [...value, inputValue]);
        updateState({ error: null, inputValue: '' });
    };

    const onChipRemove = (index: number) => {
        onChange(
            inputKey,
            value.filter((v, i) => i !== index)
        );
    };

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let newValue = e.target.value;

        switch (textTransform) {
            case 'uppercase':
                newValue = newValue.toUpperCase();
                break;

            case 'lowercase':
                newValue = newValue.toLowerCase();
                break;
        }

        updateState({ error: null, inputValue: newValue });
    };

    const SendIcon: React.FC = () => (
        <IconButton
            onClick={(e) => {
                e.preventDefault();
                onNewChip();
            }}
        >
            <Icon color={error !== null ? 'error' : 'inherit'}>keyboard_return</Icon>
        </IconButton>
    );

    const ChipDisplay: React.FC = () => (
        <>
            {value.map((value, index) => (
                <Chip
                    key={index}
                    label={value}
                    onClick={(e) => {
                        e.preventDefault();
                        onChipRemove(index);
                    }}
                />
            ))}
        </>
    );

    return (
        <FormControl fullWidth>
            <Typography variant="caption" className="espresso-chips-input-label">
                {label}
            </Typography>
            <form
                className={`espresso-chips-input ${classes.wrapper}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    onNewChip();
                }}
            >
                <TextField
                    label={label}
                    value={inputValue}
                    onChange={onTextChange}
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ endAdornment: <SendIcon /> }}
                    fullWidth
                    error={error !== null}
                    helperText={error !== null ? error : ' '}
                    style={{ marginBottom: '0' }}
                />

                <div className="espresso-chips-wrapper">
                    {value.length === 0 ? (
                        <Typography align="center" style={{ marginBottom: '5px' }}>
                            {emptyText}
                        </Typography>
                    ) : (
                        <ChipDisplay />
                    )}
                </div>
            </form>
            {helperText ? <FormHelperText style={{ margin: '3px 14px auto 14px' }}>{helperText}</FormHelperText> : null}
        </FormControl>
    );
};

export default EspressoChipsInput;
