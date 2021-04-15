import EspressoAppBar from '@components/app-bar';
import React, { useContext } from 'react';
import { ActionSetContext } from './action-set';

interface Props {
    id: string;
}

const ActionSetSettingsRoute: React.FC<Props> = ({ id }) => {
    const { crumbs, item } = useContext(ActionSetContext);
    return (
        <>
            <EspressoAppBar crumbs={[...crumbs, { text: 'Settings', link: `/action-set/${id}/settings` }]} loading={item === null} />
            <p>Hello settings!</p>
            <pre>{JSON.stringify(item, null, 4)}</pre>
        </>
    );
};

export default ActionSetSettingsRoute;
