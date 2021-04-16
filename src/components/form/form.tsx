// Libraries
import React from 'react';

// Components
import ToggleInput from '@components/form/toggle';
import { TextField } from '@material-ui/core';

// Styles
import './form.scss';

// Types
import { Object, Input } from '@typings/inputs';

interface Props<Data extends Object> {
    inputs: Input<Data>[];
    data: Data;
    onChange: (key: keyof Data, value: any) => void;
    onSave: () => void;
    saveDelay?: number;
    varient?: 'filled' | 'outlined' | 'standard';
}

class EspressoForm<Data extends Object> extends React.Component<Props<Data>> {
    private timeout: number | null = null;

    componentWillUnmount() {
        if (this.timeout !== null) clearTimeout(this.timeout);
        this.props.onSave();
    }

    render() {
        const { inputs, data, onChange, onSave, saveDelay, varient } = this.props;

        const onInputChange = (key: keyof Data, value: any) => {
            onChange(key, value);
            // @ts-ignore
            clearTimeout(this.timeout);
            this.timeout = window.setTimeout(() => {
                onSave();
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
                                    variant={varient}
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
                                <ToggleInput
                                    key={input.key as string}
                                    inputKey={input.key as string}
                                    label={input.label}
                                    helperText={input.helper}
                                    value={data[input.key]}
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
