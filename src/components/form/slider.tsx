import React from 'react';
import { Slider, Typography, FormHelperText } from '@material-ui/core';

interface Props {
    inputKey: string;
    label: string;
    helperText?: string;
    value: number;
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    step?: number;
    onChange: (key: string, value: number) => void;
}

const SliderInput: React.FC<Props> = ({ inputKey, helperText, minLabel, maxLabel, label, value, min, max, step, onChange }) => {
    return (
        <>
            <div className="espresso-slider-input">
                <Typography variant="caption" className="espresso-slider-input-label">
                    {label}
                </Typography>
                <Slider
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    valueLabelDisplay="auto"
                    onChange={(e, v) => {
                        onChange(inputKey, v as number);
                    }}
                />

                <div className="espresso-slider-input-min-max-labels">
                    <Typography
                        variant="caption"
                        onClick={() => {
                            onChange(inputKey, min);
                        }}
                    >
                        {minLabel || min}
                    </Typography>
                    <Typography
                        variant="caption"
                        onClick={() => {
                            onChange(inputKey, max);
                        }}
                    >
                        {maxLabel || max}
                    </Typography>
                </div>
            </div>
            {helperText ? <FormHelperText style={{ margin: '3px 14px 0 14px' }}>{helperText}</FormHelperText> : null}
        </>
    );
};

export default SliderInput;
