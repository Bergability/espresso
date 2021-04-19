export interface Object {
    [key: string]: any;
}

export interface Option {
    value: string;
    text: string;
    catigory?: string;
}

export type Options = Option[] | string;

interface InputBase<Data extends Object> {
    type: string;
    label: string;
    default: any;
    key: keyof Data;
    helper?: string;
}

export interface TextInput<Data extends Object> extends InputBase<Data> {
    type: 'text';
    default: string;
}

export interface NumberInput<Data extends Object> extends InputBase<Data> {
    type: 'number';
    default: number;
    min?: number;
    max?: number;
}

export interface ToggleInput<Data extends Object> extends InputBase<Data> {
    type: 'toggle';
    default: boolean;
}

export interface SelectInput<Data extends Object> extends InputBase<Data> {
    type: 'select';
    options: Options;
    default: string | string[];
    multiple?: boolean;
}

export interface ChipsInput<Data extends Object> extends InputBase<Data> {
    type: 'chips';
    label: string;
    default: string[];
    emptyText: string;
    duplicates?: boolean;
    textTransform?: 'uppercase' | 'lowercase';
}

export interface ButtonInput {
    type: 'button';
    label: string;
    link: string;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'default' | 'inherit' | 'primary' | 'secondary';
}

export type Input<Data extends Object> = TextInput<Data> | NumberInput<Data> | ToggleInput<Data> | SelectInput<Data> | ChipsInput<Data> | ButtonInput;
export type InputType = Input<{}>['type'];
