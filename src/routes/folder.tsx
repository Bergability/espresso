// Libraries
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import { Icon, IconButton } from '@material-ui/core';
import EspressoAppBar, { Crumb } from '@components/app-bar';
import NewItemDialog from '@components/folder/new-item-dialog';
import ItemDisplayBlock from '@components/folder/item-display-block';

// Utilities
import api from '@utilities/api';

// Styles
import './folder.scss';

// Types
import { Item } from '@typings/items';
import { RouteComponentProps } from 'react-router-dom';
import { GetFolderPayload, GetItemsPayload } from '@typings/api';

interface RouteParams {
    id?: string;
}

interface State {
    items: Item[];
    crumbs: Crumb[];
    open: boolean;
}

const FolderRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const [state, updateState] = useState<State | null>(null);
    const id = props.match.params.id;

    const refresh = () => {
        api.fetch<GetFolderPayload>(`/folder/${id || 'home'}`, 'get')
            .then((res) => {
                updateState({
                    open: false,
                    ...res,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        refresh();
    }, [id]);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const onNewItemClick = () => {
        updateState({ ...state, open: true });
    };

    const onClose = () => {
        updateState({ ...state, open: false });
    };

    const onNewItem = (name: string, type: Item['type']) => {
        const payload = { name, type };

        // TODO Type check this better
        // @ts-ignore
        if (id) payload.parent = id;

        api.fetch<{ item: Item }>('/items', 'post', JSON.stringify(payload))
            .then((res) => {
                updateState({
                    ...state,
                    open: false,
                    items: [...state.items, res.item],
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <>
            <EspressoAppBar crumbs={state.crumbs} refresh={refresh}>
                <IconButton onClick={onNewItemClick}>
                    <Icon>add_box</Icon>
                </IconButton>
            </EspressoAppBar>

            <div className="route-wrapper">
                <ItemDisplayBlock type="folder" items={state.items} refresh={refresh} />
                <ItemDisplayBlock type="action-set" items={state.items} refresh={refresh} />
                <ItemDisplayBlock type="list" items={state.items} refresh={refresh} />
            </div>

            <NewItemDialog open={state.open} onClose={onClose} onNewItem={onNewItem} />
        </>
    );
};

export default withRouter(FolderRoute);
