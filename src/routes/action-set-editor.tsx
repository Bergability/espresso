import EspressoAppBar from '@components/app-bar';
import { Icon, IconButton } from '@material-ui/core';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ActionSetContext } from './action-set';

interface Props {
    id: string;
}

const ActionSetEditorRoute: React.FC<Props> = ({ id }) => {
    const { crumbs, item } = useContext(ActionSetContext);
    return (
        <>
            <EspressoAppBar crumbs={crumbs} loading={item === null}>
                <IconButton component={Link} to={`/action-set/${id}/settings`}>
                    <Icon>settings</Icon>
                </IconButton>
            </EspressoAppBar>
            <p>Hello editor!</p>
            <pre>{JSON.stringify(item, null, 4)}</pre>
        </>
    );
};

export default ActionSetEditorRoute;
