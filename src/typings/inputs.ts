export interface Object {
    [key: string]: any;
}

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

export type Input<Data extends Object> = TextInput<Data> | ToggleInput<Data>;
export type InputType = Input<{}>['type'];
