// Libraries
import React from 'react';

// Components
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import EspressoToggleInput from '@components/form/toggle';
import EspressoSelectInput from '@components/form/select';
import EspressoChipsInput from '@components/form/chips';
import RepeaterInput from '@components/form/repeater';

// Styles
import './form.scss';

// Types
import { Object, Input } from '@typings/inputs';

interface Props<Data extends Object> {
    inputs: Input<Data>[];
    data: Data;
    onChange: (key: keyof Data, value: any) => void;
    onSave?: (data: Data) => void;
    saveDelay?: number;
    variant?: 'filled' | 'outlined' | 'standard';
}

class EspressoForm<Data extends Object = {}> extends React.Component<Props<Data>> {
    private timeout: number | null = null;

    componentWillUnmount() {
        if (this.timeout !== null) clearTimeout(this.timeout);
        if (this.props.onSave) this.props.onSave(this.props.data);
    }

    render() {
        const { inputs, data, onChange, onSave, saveDelay, variant } = this.props;

        const onInputChange = (key: keyof Data, value: any) => {
            onChange(key, value);
            if (this.timeout !== null) clearTimeout(this.timeout);

            this.timeout = window.setTimeout(() => {
                if (onSave) onSave({ ...data, [key]: value });
            }, (saveDelay !== undefined ? saveDelay : 3) * 1000);
        };

        return (
            <div className="espresso-form">
                {inputs.map((input, index) => {
                    switch (input.type) {
                        case 'button':
                            return (
                                <Button key={index} to={input.link} component={Link} variant={input.variant} color={input.color}>
                                    {input.label}
                                </Button>
                            );

                        case 'text':
                            // TODO make a better number input
                            return (
                                <TextField
                                    key={input.key as string}
                                    label={input.label}
                                    value={data[input.key] === undefined ? '' : data[input.key]}
                                    variant={variant}
                                    helperText={input.helper}
                                    fullWidth
                                    onChange={(e) => {
                                        onInputChange(input.key, e.target.value);
                                    }}
                                />
                            );

                        case 'number':
                            return (
                                <TextField
                                    key={input.key as string}
                                    type="number"
                                    label={input.label}
                                    value={data[input.key] === undefined ? '' : data[input.key]}
                                    variant={variant}
                                    helperText={input.helper}
                                    fullWidth
                                    onChange={(e) => {
                                        onInputChange(input.key, e.target.value);
                                    }}
                                />
                            );

                        case 'toggle':
                            return (
                                <EspressoToggleInput
                                    key={input.key as string}
                                    inputKey={input.key as string}
                                    label={input.label}
                                    helperText={input.helper}
                                    value={data[input.key]}
                                    onChange={onInputChange}
                                />
                            );

                        case 'select':
                            return (
                                <EspressoSelectInput
                                    key={input.key as string}
                                    inputKey={input.key as string}
                                    label={input.label}
                                    helperText={input.helper}
                                    value={data[input.key]}
                                    variant={variant}
                                    options={input.options}
                                    multiple={input.multiple}
                                    onChange={onInputChange}
                                />
                            );

                        case 'chips':
                            return (
                                <EspressoChipsInput
                                    key={input.key as string}
                                    inputKey={input.key as string}
                                    label={input.label}
                                    helperText={input.helper}
                                    value={data[input.key]}
                                    duplicates={input.duplicates}
                                    textTransform={input.textTransform}
                                    emptyText={input.emptyText}
                                    onChange={onInputChange}
                                />
                            );

                        case 'repeater':
                            return (
                                <RepeaterInput
                                    key={input.key as string}
                                    inputKey={input.key as string}
                                    value={data[input.key]}
                                    label={input.label}
                                    helperText={input.helper}
                                    inputs={input.inputs}
                                    addLabel={input.addLabel}
                                    emptyLabel={input.emptyLabel}
                                    removeLabel={input.removeLabel}
                                    min={input.min}
                                    max={input.max}
                                    onChange={onInputChange}
                                />
                            );

                        // default:
                        //     return <p key={input.key as string}>{`${input.label} - ${input.type}`}</p>;
                    }
                })}
            </div>
        );
    }
}

export default EspressoForm;
