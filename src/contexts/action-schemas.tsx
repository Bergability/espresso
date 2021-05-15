import React, { createContext, useEffect, useState } from 'react';
import { ActionSchema } from '@typings/espresso';
import api from '@utilities/api';

interface SortedObject {
    [key: string]: ActionSchema[];
}

interface SortedList {
    name: string;
    schemas: ActionSchema[];
}

interface State {
    schemas: ActionSchema[];
    sorted: SortedList[];
}

const ActionSchemaContext = createContext<State>({ schemas: [], sorted: [] });

export const ActionSchemaContextWrapper: React.FC = ({ children }) => {
    const [state, updateState] = useState<State>({ schemas: [], sorted: [] });

    useEffect(() => {
        api.fetch<ActionSchema[]>('/schemas/actions', 'get')
            .then((res) => {
                const sortedObject: SortedObject = res.reduce<SortedObject>((acc, schema) => {
                    const key = `${schema.provider} ${schema.catigory}`;

                    if (acc[key] === undefined) acc[key] = [];

                    acc[key] = [...acc[key], schema].sort((a, b) => {
                        if (a.name > b.name) return 1;
                        if (a.name < b.name) return -1;
                        return 0;
                    });

                    return acc;
                }, {});

                const sortedList: SortedList[] = Object.entries(sortedObject).reduce<SortedList[]>((acc, [name, schemas]) => {
                    acc = [...acc, { name, schemas }].sort((a, b) => {
                        if (a.name > b.name) return 1;
                        if (a.name < b.name) return -1;
                        return 0;
                    });

                    return acc;
                }, []);

                updateState({ schemas: res, sorted: sortedList });
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return <ActionSchemaContext.Provider value={state}>{children}</ActionSchemaContext.Provider>;
};

export default ActionSchemaContext;
