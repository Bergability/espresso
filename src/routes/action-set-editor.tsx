// Libraries
import React, { useContext } from 'react';

// Components
import { Link } from 'react-router-dom';
import { Icon, IconButton } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';

// Contexts
import { ActionSetContext } from './action-set';

// Types
import { Crumb } from '@components/app-bar';

interface Props {
    id: string;
}

const ActionSetEditorRoute: React.FC<Props> = ({ id }) => {
    const { item } = useContext(ActionSetContext);

    if (item === null) return null;

    const crumbs: Crumb[] = [
        { text: 'Home', link: `/` },
        { text: item.name, link: `/action-set/${id}` },
    ];

    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={item === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>
            <pre>{JSON.stringify(item, null, 4)}</pre>
            <p>Hello editor!</p>
        </>
    );
};

export default ActionSetEditorRoute;
