// Libraries
import React from 'react';

// Components
import { FormControl, Switch, Typography, FormHelperText } from '@material-ui/core';

// Styles
import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    toggle: {
        // borderColor: theme.palette.action.disabled,
        borderRadius: theme.shape.borderRadius,
        '&:active': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

// Types
interface Props {
    inputKey: string;
    label: string;
    value: boolean;
    helperText?: string;
    onChange: (key: string, value: boolean) => void;
}

const ToggleInput: React.FC<Props> = ({ inputKey, label, value, onChange, helperText }) => {
    const classes = styles();

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        onChange(inputKey, !value);
    };

    return (
        <FormControl fullWidth>
            <div className={`espresso-toggle-input ${classes.toggle}`} onClick={onClick}>
                <Typography>{label}</Typography>
                <Switch color="primary" checked={value} />
            </div>

            {helperText ? <FormHelperText style={{ margin: '3px 14px auto 14px' }}>{helperText}</FormHelperText> : null}
        </FormControl>
    );
};

export default ToggleInput;
