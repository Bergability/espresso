// Utilities
import api from '@utilities/api';

// Types
import { Option, Input, Object } from '@typings/inputs';

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
