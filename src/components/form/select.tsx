// Libraries
import React, { useEffect, useState } from 'react';

// Components
import { FormControl, Select, MenuItem, InputLabel, FormHelperText, ListSubheader } from '@material-ui/core';

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

    if (
        computedOptions.reduce<boolean>((acc, option) => {
            if (option.catigory) return true;
            return acc;
        }, false)
    ) {
        const sorted = computedOptions.reduce<{ [key: string]: Option[] }>((acc, option) => {
            if (!option.catigory) option.catigory = 'Uncategorized';
            if (!acc[option.catigory]) acc[option.catigory] = [];
            acc[option.catigory] = [...acc[option.catigory], option].sort((a, b) => {
                if (a.text > b.text) return 1;
                if (a.text < b.text) return -1;
                return 0;
            });

            return acc;
        }, {});

        const list = Object.entries(sorted).reduce<{ catigory: string; options: Option[] }[]>((acc, [key, options]) => {
            acc = [...acc, { catigory: key, options }].sort((a, b) => {
                if (a.catigory > b.catigory) return 1;
                if (a.catigory < b.catigory) return -1;
                return 0;
            });
            return acc;
        }, []);

        const flat = list.reduce<(string | Option)[]>((acc, group) => {
            return [...acc, group.catigory, ...group.options];
        }, []);

        return (
            <FormControl variant={variant} fullWidth className="espresso-select-input sorted">
                <InputLabel>{label}</InputLabel>
                {/* @ts-ignore */}
                <Select label={label} value={value} variant={variant} onChange={onSelectChange} multiple={multiple}>
                    {flat.map((item) => {
                        if (typeof item === 'string') {
                            return (
                                <ListSubheader className="cat-list-subheader" key={item}>
                                    {item}
                                </ListSubheader>
                            );
                        } else {
                            return (
                                <MenuItem key={item.value} value={item.value} className="cat-list-menu-item">
                                    {item.text}
                                </MenuItem>
                            );
                        }
                    })}
                </Select>

                {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
            </FormControl>
        );
    }

    return (
        <FormControl variant={variant} fullWidth className="espresso-select-input">
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
