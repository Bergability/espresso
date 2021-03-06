export interface Object {
    [key: string]: any;
}

export interface Color {
    alpha: number;
    css: { backgroundColor: string };
    format?: string;
    hex: string;
    hsl: [number, number, number];
    hsv: [number, number, number];
    name?: string;
    raw: [number, number, number];
    rgb: [number, number, number];
    value?: number;
}

type ComparisonOperators = 'equal' | 'not-equal' | 'greater-than' | 'greater-than-or-equal' | 'less-than' | 'less-than-or-equal';
type ArrayLengthComparisonOperators =
    | 'array-length-equal'
    | 'array-length-not-equal'
    | 'array-length-greater-than'
    | 'array-length-greater-than-or-equal'
    | 'array-length-less-than'
    | 'array-length-less-than-or-equal'
    | 'array-contains';

export interface Condition<Data extends Object = {}> {
    value: keyof Data;
    operator: ComparisonOperators | ArrayLengthComparisonOperators;
    comparison: any;
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
    conditions?: (Condition<Data> | Condition<Data>[])[];
}

export interface InputSection<Data extends Object = {}, RepeatData extends Object = {}> {
    type: 'section';
    title: string;
    description?: string[];
    inputs: Input<Data, RepeatData>[];
}

export interface Title {
    type: 'title';
    title: string;
    description?: string[];
}

export interface TextInput<Data extends Object> extends InputBase<Data> {
    type: 'text';
    default: string;
}

export interface ColorInput<Data extends Object> extends InputBase<Data> {
    type: 'color';
    default: string;
}

export interface NumberInput<Data extends Object> extends InputBase<Data> {
    type: 'number';
    default: number;
    min?: number;
    max?: number;
}

export interface SliderInput<Data extends Object> extends InputBase<Data> {
    type: 'slider';
    default: number;
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    step?: number;
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
    default: string[];
    emptyText: string;
    duplicates?: boolean;
    textTransform?: 'uppercase' | 'lowercase';
}

export interface RepeaterInput<Data extends Object, RepeatData extends Object = {}> extends InputBase<Data> {
    type: 'repeater';
    default: RepeatData[];
    inputs: Input<RepeatData>[];
    addLabel: string;
    emptyLabel: string;
    removeLabel: string;
    min?: number;
    max?: number;
}

export interface ButtonInput {
    type: 'button';
    label: string;
    link: string;
    external?: boolean;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'default' | 'inherit' | 'primary' | 'secondary';
}

export type Input<Data extends Object = {}, RepeatData extends Object = {}> =
    | InputSection<Data, RepeatData>
    | TextInput<Data>
    | ColorInput<Data>
    | NumberInput<Data>
    | SliderInput<Data>
    | ToggleInput<Data>
    | SelectInput<Data>
    | ChipsInput<Data>
    | RepeaterInput<Data, RepeatData>
    | Title
    | ButtonInput;
export type InputType = Input<{}>['type'];
