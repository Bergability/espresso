import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import FolderRoute from '@routes/folder';

interface Params {
    id?: string;
}

const ItemRoute: React.FC<RouteComponentProps<Params>> = (props) => {
    const parent = props.match.params.id;

    // If no ID is set we are on the home folder
    if (parent === undefined) {
        return <FolderRoute />;
    }

    return <p>{parent || 'Home'}</p>;
};

export default withRouter(ItemRoute);
