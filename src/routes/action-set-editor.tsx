// Libraries
import React, { useEffect, useState } from 'react';

// Components
import { Link } from 'react-router-dom';
import { Icon, IconButton } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';

// Utilities
import api from '@utilities/api';

// Types
import { Crumb } from '@components/app-bar';
import { ActionSet } from '@typings/items';
import { GetPutActionSetPayload } from '@typings/api';

interface Props {
    id: string;
}

const ActionSetEditorRoute: React.FC<Props> = ({ id }) => {
    const [set, updateSet] = useState<ActionSet | null>(null);

    useEffect(() => {
        api.fetch<GetPutActionSetPayload>(`/action-set/${id}`, 'get')
            .then((res) => {
                updateSet(res.set);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    if (set === null) return null;

    // TODO add these to the API for action sets!
    const crumbs: Crumb[] = [
        { text: 'Home', link: `/` },
        { text: set.name, link: `/action-set/${id}` },
    ];

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={set === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>
            <pre>{JSON.stringify(set, null, 4)}</pre>
            <p>Hello editor!</p>
        </>
    );
};

export default ActionSetEditorRoute;
