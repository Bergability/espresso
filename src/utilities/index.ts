// Utilities
import api from './api';

// Types
import { Option, Input, Object, Condition } from '@typings/inputs';

export const getOptions = async (slug: string): Promise<Option[]> => {
    try {
        return (await api.fetch(`/options/${slug}`, 'get')) as Option[];
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const generateDefaults = <Data>(inputs: Input<Data>[], data: Object = {}) => {
    inputs.forEach((input) => {
        if (input.type === 'button') return;

        // @ts-ignore
        if (data[input.key] === undefined) {
            // @ts-ignore
            data[input.key] = input.default;
        }
    });

    return data;
};

const evaluateCondition = (condition: Condition, data: Object): boolean => {
    let met: boolean = false;
    const { value, operator, comparison } = condition;
    switch (operator) {
        // Compairson Ops
        case 'equal':
            if (data[value] === comparison) met = true;
            break;

        case 'not-equal':
            if (data[value] !== comparison) met = true;
            break;

        case 'greater-than':
            if (data[value] > comparison) met = true;
            break;

        case 'greater-than-or-equal':
            if (data[value] >= comparison) met = true;
            break;

        case 'less-than':
            if (data[value] < comparison) met = true;
            break;

        case 'less-than-or-equal':
            if (data[value] <= comparison) met = true;
            break;

        // Array compairison ops
        case 'array-length-equal':
            if (data[value].length === comparison) met = true;
            break;

        case 'array-length-not-equal':
            if (data[value].length !== comparison) met = true;
            break;

        case 'array-length-greater-than':
            if (data[value].length > comparison) met = true;
            break;

        case 'array-length-greater-than-or-equal':
            if (data[value].length >= comparison) met = true;
            break;

        case 'array-length-less-than':
            if (data[value].length < comparison) met = true;
            break;

        case 'array-length-less-than-or-equal':
            if (data[value].length <= comparison) met = true;
            break;
    }

    return met;
};

export const evaluateConditions = (conditions: Condition[], data: Object): boolean => {
    let met: boolean = true;
    conditions.forEach((condition) => {
        // console.log(value);
        // console.log(data);

        // console.log(operator);
        // console.log(comparison);
        // console.log(data[value]);
        if (evaluateCondition(condition, data) === false) met = false;
    });

    return met;
};
