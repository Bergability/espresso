// Libraries
import React from 'react';

// Components
import { Link } from 'react-router-dom';
import { ColorPicker } from 'material-ui-color';
import { Button, TextField, Slider } from '@material-ui/core';
import EspressoToggleInput from '@components/form/toggle';
import EspressoSelectInput from '@components/form/select';
import EspressoChipsInput from '@components/form/chips';
import RepeaterInput from '@components/form/repeater';
import FormSection from '@components/form/form-section';

// Styles
import './form.scss';

// Types
import { Object, Input } from '@typings/inputs';
import { evaluateConditions, generateDefaults, openInBrowser } from '@utilities';

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
        const { inputs, data, onChange, onSave, saveDelay, variant = 'outlined' } = this.props;

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
                    if (
                        input.type !== 'button' &&
                        input.type !== 'section' &&
                        input.type !== 'title' &&
                        input.conditions &&
                        input.conditions.length > 0
                    ) {
                        // @ts-ignore
                        const shouldRender = evaluateConditions(input.conditions, data);
                        if (!shouldRender) return null;
                    }

                    switch (input.type) {
                        case 'section':
                        case 'title':
                            return (
                                <FormSection
                                    key={index}
                                    data={data}
                                    // @ts-ignore
                                    inputs={input.inputs ? input.inputs : []}
                                    title={input.title}
                                    description={input.description}
                                    onChange={onInputChange}
                                />
                            );

                        case 'button':
                            return (
                                <Button
                                    key={index}
                                    to={input.link}
                                    component={Link}
                                    variant={input.variant}
                                    color={input.color}
                                    onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                        if (input.external === true) {
                                            e.preventDefault();
                                            openInBrowser(input.link);
                                        }
                                    }}
                                >
                                    {input.label}
                                </Button>
                            );

                        case 'text':
                            return (
                                <TextField
                                    key={input.key as string}
                                    label={input.label}
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
                                    variant={variant}
                                    helperText={input.helper}
                                    fullWidth
                                    onChange={(e) => {
                                        onInputChange(input.key, e.target.value);
                                    }}
                                />
                            );

                        case 'color':
                            // TODO make better :^)
                            return (
                                <ColorPicker
                                    key={input.key as string}
                                    // label={input.label}
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
                                    // variant={variant}
                                    // helperText={input.helper}
                                    // fullWidth
                                    disableAlpha
                                    onChange={(e) => {
                                        onInputChange(input.key, e);
                                    }}
                                />
                            );

                        case 'number':
                            return (
                                <TextField
                                    key={input.key as string}
                                    type="number"
                                    label={input.label}
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
                                    variant={variant}
                                    helperText={input.helper}
                                    fullWidth
                                    onChange={(e) => {
                                        onInputChange(input.key, e.target.value);
                                    }}
                                />
                            );

                        case 'slider':
                            return (
                                <Slider
                                    key={input.key as string}
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
                                    min={input.min}
                                    max={input.max}
                                    step={input.step}
                                    valueLabelDisplay="auto"
                                    onChange={(e, value) => {
                                        onInputChange(input.key, value);
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
                                    value={data[input.key] === undefined ? input.default : data[input.key]}
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
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
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
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
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
                                    value={data[input.key] == undefined ? input.default : data[input.key]}
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
