import React, { createContext, useEffect, useState } from 'react';
import { ActionSchema } from '@typings/espresso';
import api from '@utilities/api';

type State = ActionSchema[];

const ActionSchemaContext = createContext<State>([]);

export const ActionSchemaContextWrapper: React.FC = ({ children }) => {
    const [state, updateState] = useState<State>([]);

    useEffect(() => {
        api.fetch<State>('/schemas/actions', 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return <ActionSchemaContext.Provider value={state}>{children}</ActionSchemaContext.Provider>;
};

export default ActionSchemaContext;
