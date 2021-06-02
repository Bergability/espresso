import { shell } from 'electron';
import ColorUtility from 'color';

// Utilities
import api from './api';

// Types
import { Option, Input, Object, Condition, Color } from '@typings/inputs';

export const openInBrowser = (url: string) => {
    shell.openExternal(url);
};

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

        if (input.type === 'section') {
            data = { ...data, ...generateDefaults(input.inputs) };
        }

        // @ts-ignore
        if (data[input.key] === undefined) {
            // @ts-ignore
            data[input.key] = input.default;
        }
    });

    return data;
};

export const copyToClipboard = (text: string) => {
    // @ts-ignore
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
        if (result.state == 'granted' || result.state == 'prompt') {
            navigator.clipboard.writeText(text);
        }
    });
};

export const getColorValue = (raw: string | Color): Color => {
    // If raw is not a string, it is already a color object
    if (typeof raw !== 'string')
        return {
            ...raw,
            hex: `#${raw.hex}`,
        };

    // TODO add CSS color values
    const color = ColorUtility(raw, 'hex');

    return {
        alpha: color.alpha(),
        css: { backgroundColor: color.hex() },
        hex: color.hex(),
        hsl: color.hsl().array() as Color['hsl'],
        hsv: color.hsv().array() as Color['hsv'],
        raw: color.rgb().array() as Color['raw'],
        rgb: color.rgb().array() as Color['rgb'],
    };
};

const evaluateCondition = (condition: Condition, data: Object): boolean => {
    const { value, operator, comparison } = condition;
    switch (operator) {
        // Compairson Ops
        case 'equal':
            if (data[value] === comparison) return true;
            break;

        case 'not-equal':
            if (data[value] !== comparison) return true;
            break;

        case 'greater-than':
            if (data[value] > comparison) return true;
            break;

        case 'greater-than-or-equal':
            if (data[value] >= comparison) return true;
            break;

        case 'less-than':
            if (data[value] < comparison) return true;
            break;

        case 'less-than-or-equal':
            if (data[value] <= comparison) return true;
            break;

        // Array compairison ops
        case 'array-length-equal':
            if (data[value].length === comparison) return true;
            break;

        case 'array-length-not-equal':
            if (data[value].length !== comparison) return true;
            break;

        case 'array-length-greater-than':
            if (data[value].length > comparison) return true;
            break;

        case 'array-length-greater-than-or-equal':
            if (data[value].length >= comparison) return true;
            break;

        case 'array-length-less-than':
            if (data[value].length < comparison) return true;
            break;

        case 'array-length-less-than-or-equal':
            if (data[value].length <= comparison) return true;
            break;

        case 'array-contains':
            if ((data[value] as string[]).includes(comparison as string) <= comparison) return true;
            break;
    }

    return false;
};

export const evaluateConditions = (conditions: (Condition | Condition[])[], data: Object): boolean => {
    // The base array of condtions is treated as || conditions
    return conditions.reduce<boolean>((acc, condition) => {
        // If an array of conditions is passed treat them as && condtions
        if (Array.isArray(condition)) {
            const and = condition.reduce<boolean>((a, c) => {
                if (evaluateCondition(c, data) === false) return false;
                return a;
            }, true);

            if (and === true) return true;
        } else {
            if (evaluateCondition(condition, data) === true) return true;
        }
        return acc;
    }, false);
};
