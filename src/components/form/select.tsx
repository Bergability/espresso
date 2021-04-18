// Libraries
import React, { useEffect, useState } from 'react';

// Components
import { FormControl, Select, MenuItem, InputLabel, FormHelperText } from '@material-ui/core';

// Styles
// import { makeStyles } from '@material-ui/core';
//
// const styles = makeStyles((theme) => ({
//     toggle: {
//         // borderColor: theme.palette.action.disabled,
//         borderRadius: theme.shape.borderRadius,
//         '&:active': {
//             borderColor: theme.palette.primary.main,
//         },
//     },
// }));

// Types
import { Option, Options } from '@typings/inputs';
import { getOptions } from '@utilities';

interface Props {
    inputKey: string;
    label: string;
    value: string | string[];
    options: Options;
    multiple?: boolean;
    variant?: 'filled' | 'outlined' | 'standard';
    helperText?: string;
    onChange: (key: string, value: string | string[]) => void;
}

interface MultiProps extends Props {
    multiple: true;
    value: string[];
}

const EspressoSelectInput: React.FC<Props | MultiProps> = ({ inputKey, label, value, variant, options, helperText, multiple, onChange }) => {
    const [computedOptions, updateComputedOptions] = useState<Option[]>(typeof options !== 'string' ? options : []);

    // Defaulter
    if (value === undefined) {
        if (multiple === true) value = [];
        else value = '';
    }

    // const classes = styles();
    useEffect(() => {
        if (typeof options === 'string') {
            getOptions(options)
                .then((options) => {
                    updateComputedOptions(options);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, []);

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        onChange(inputKey, e.target.value);
    };

    return (
        <FormControl variant={variant} fullWidth>
            <InputLabel>{label}</InputLabel>
            {/* @ts-ignore */}
            <Select label={label} value={value} variant={variant} onChange={onSelectChange} multiple={multiple}>
                {computedOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.text}
                    </MenuItem>
                ))}
            </Select>

            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
};

export default EspressoSelectInput;
