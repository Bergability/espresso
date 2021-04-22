import { Button, FormControl, Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { Input, Object } from '@typings/inputs';
import { generateDefaults } from '@utilities';
import React from 'react';
import EspressoForm from './form';

interface Props {
    inputs: Input[];
    inputKey: string;
    value: Object[];
    label: string;
    addLabel: string;
    emptyLabel: string;
    removeLabel: string;
    onChange: (key: string, value: any) => void;
    helperText?: string;
    min?: number;
    max?: number;
}

const RepeaterInput: React.FC<Props> = ({ inputs, inputKey, label, value, helperText, addLabel, emptyLabel, removeLabel, min, max, onChange }) => {
    // const onChange = (key: string, value: any) => {};

    const onAdd = () => {
        const newData = generateDefaults(inputs);
        onChange(inputKey, [...value, newData]);
    };

    const onRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(inputKey, newValue);
    };

    const onMoveUp = (index: number) => {
        const newValue = [...value];
        const move = newValue.splice(index, 1);
        newValue.splice(index - 1, 0, ...move);
        onChange(inputKey, newValue);
    };

    const onMoveDown = (index: number) => {
        const newValue = [...value];
        const move = newValue.splice(index, 1);
        newValue.splice(index + 1, 0, ...move);
        onChange(inputKey, newValue);
    };

    const onRepeatChange = (index: number, key: string, v: any) => {
        const newValue = [...value];
        newValue[index][key] = v;
        onChange(inputKey, newValue);
    };

    return (
        <FormControl fullWidth className="espresso-repeater-input">
            <Typography variant="caption" className="espresso-repeater-input-label">
                {label}
            </Typography>
            {value.length === 0 ? (
                <Typography align="center" style={{ marginBottom: 30, marginTop: 25 }}>
                    {emptyLabel}
                </Typography>
            ) : null}
            {value.map((data, index) => (
                <div key={index} className="espresso-repeater-form-wrapper">
                    <div className="espresso-repeater-form-index">
                        <Typography variant="caption">( {index + 1} )</Typography>
                    </div>

                    <div className="espresso-repeater-form">
                        <EspressoForm<{}>
                            data={data}
                            variant="filled"
                            onChange={(key: string, v: any) => {
                                onRepeatChange(index, key, v);
                            }}
                            inputs={inputs}
                        />
                    </div>

                    <div className="espresso-repeater-actions">
                        {index === 0 ? null : (
                            <Tooltip title="Move up" placement="top">
                                <IconButton
                                    size="small"
                                    className="espresso-repeater-move-up"
                                    onClick={() => {
                                        onMoveUp(index);
                                    }}
                                >
                                    <Icon fontSize="small">keyboard_arrow_up</Icon>
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title={removeLabel} placement="top">
                            <IconButton
                                className="espresso-repeater-remove"
                                size="small"
                                onClick={() => {
                                    onRemove(index);
                                }}
                            >
                                <Icon fontSize="small">delete</Icon>
                            </IconButton>
                        </Tooltip>

                        {index === value.length - 1 ? null : (
                            <Tooltip title="Move down" placement="top">
                                <IconButton
                                    size="small"
                                    className="espresso-repeater-move-down"
                                    onClick={() => {
                                        onMoveDown(index);
                                    }}
                                >
                                    <Icon fontSize="small">keyboard_arrow_down</Icon>
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
            ))}
            <Button variant="outlined" onClick={onAdd}>
                {addLabel}
            </Button>
        </FormControl>
    );
};

export default RepeaterInput;
