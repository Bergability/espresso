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
    key: keyof Data;
    helper?: string;
}

export interface TextInput<Data extends Object> extends InputBase<Data> {
    type: 'text';
}

export interface ToggleInput<Data extends Object> extends InputBase<Data> {
    type: 'toggle';
}

export interface SelectInput<Data extends Object> extends InputBase<Data> {
    type: 'select';
    options: Options;
    multiple?: boolean;
}

export type Input<Data extends Object> = TextInput<Data> | ToggleInput<Data> | SelectInput<Data>;
export type InputType = Input<{}>['type'];
