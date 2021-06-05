import React from 'react';
import { Typography } from '@material-ui/core';
import { Input, Object } from '../../typings/inputs';
import EspressoForm from './form';

interface Props {
    inputs: Input[];
    data: Object;
    title: string;
    description?: string[];
    onChange: (key: string, value: any) => void;
}

const FormSection: React.FC<Props> = ({ inputs, data, title, description, onChange }) => {
    return (
        <div className={`espresso-form-section ${inputs.length === 0 ? 'only-title' : ''}`}>
            <div className="espresso-form-section-header">
                <Typography className="espresso-form-section-title">{title}</Typography>
                {description
                    ? description.map((text, index) => {
                          if (text === '') return <br key={index} />;
                          return (
                              <Typography key={index} className="espresso-form-section-description">
                                  {text}
                              </Typography>
                          );
                      })
                    : null}
            </div>
            {inputs.length === 0 ? null : (
                <EspressoForm<{}>
                    data={data}
                    variant="outlined"
                    onChange={(key: string, v: any) => {
                        onChange(key, v);
                    }}
                    inputs={inputs}
                />
            )}
        </div>
    );
};

export default FormSection;
