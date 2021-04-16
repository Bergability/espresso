// Utilities
import api from '@utilities/api';

// Types
import { Option } from '@typings/inputs';

export const getOptions = async (slug: string): Promise<Option[]> => {
    try {
        return (await api.get(`/options/${slug}`)) as Option[];
    } catch (e) {
        console.log(e);
        return [];
    }
};
