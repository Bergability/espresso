import React from 'react';
import { Button, FormControl, Icon, Typography, IconButton, Tooltip } from '@material-ui/core';
import { Input, Object } from '../../typings/inputs';
import EspressoForm from './form';

interface Props {
    inputs: Input[];
    data: Object;
    title: string;
    description?: string;
    onChange: (key: string, value: any) => void;
}

const FormSection: React.FC<Props> = ({ inputs, data, title, description, onChange }) => {
    return (
        <div className="espresso-form-section">
            <div className="espresso-form-section-header">
                <Typography className="espresso-form-section-title">{title}</Typography>
                {description ? <Typography className="espresso-form-section-description">{description}</Typography> : null}
            </div>
            <EspressoForm<{}>
                data={data}
                variant="outlined"
                onChange={(key: string, v: any) => {
                    onChange(key, v);
                }}
                inputs={inputs}
            />
        </div>
    );
};

export default FormSection;
