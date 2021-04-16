// Libraries
import React from 'react';

// Components
import { TextField } from '@material-ui/core';
import EspressoToggleInput from '@components/form/toggle';
import EspressoSelectInput from '@components/form/select';

// Styles
import './form.scss';

// Types
import { Object, Input } from '@typings/inputs';

interface Props<Data extends Object> {
    inputs: Input<Data>[];
    data: Data;
    onChange: (key: keyof Data, value: any) => void;
    onSave: (data: Data) => void;
    saveDelay?: number;
    variant?: 'filled' | 'outlined' | 'standard';
}

class EspressoForm<Data extends Object> extends React.Component<Props<Data>> {
    private timeout: number | null = null;

    componentWillUnmount() {
        if (this.timeout !== null) clearTimeout(this.timeout);
        this.props.onSave(this.props.data);
    }

    render() {
        const { inputs, data, onChange, onSave, saveDelay, variant } = this.props;

        const onInputChange = (key: keyof Data, value: any) => {
            onChange(key, value);
            if (this.timeout !== null) clearTimeout(this.timeout);

            this.timeout = window.setTimeout(() => {
                onSave({ ...data, [key]: value });
            }, (saveDelay !== undefined ? saveDelay : 3) * 1000);
        };

        return (
            <form className="espresso-form">
                {inputs.map((input) => {
                    switch (input.type) {
                        case 'text':
                            return (
                                // <FormControl key={input.key as string} fullWidth>
                                <TextField
                                    key={input.key as string}
                                    label={input.label}
                                    value={data[input.key]}
                                    variant={variant}
                                    helperText={input.helper}
                                    fullWidth
                                    onChange={(e) => {
                                        onInputChange(input.key, e.target.value);
                                    }}
                                />
                                // </FormControl>
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

                        // default:
                        //     return <p key={input.key as string}>{`${input.label} - ${input.type}`}</p>;
                    }
                })}
            </form>
        );
    }
}

export default EspressoForm;
