// Libraries
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import { Icon, IconButton } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import NewItemDialog from '@components/folder/new-item-dialog';
import ItemDisplayBlock from '@components/folder/item-display-block';

// Utilities
import api from '@utilities/api';

// Styles
import './folder.scss';

// Types
import { Item } from '@typings/items';
import { RouteComponentProps } from 'react-router-dom';
import { GetItemPayload } from '@typings/api';

interface RouteParams {
    id?: string;
}

interface State {
    items: Item[];
    loaded: boolean;
    open: boolean;
    error?: string;
}

const defaultState: State = {
    items: [],
    loaded: false,
    open: false,
};

const FolderRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const [state, updateState] = useState<State>(defaultState);
    // const id = props.match.params.id;

    useEffect(() => {
        // TODO add parent searching
        api.fetch<GetItemPayload>('/items', 'get')
            .then((payload) => {
                updateState({ ...state, items: payload.items, loaded: true });
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const onNewItemClick = () => {
        updateState({ ...state, open: true });
    };

    const onClose = () => {
        updateState({ ...state, open: false });
    };

    const onNewItem = (name: string, type: Item['type']) => {
        api.fetch<{ item: Item }>('/items', 'post', JSON.stringify({ name, type }))
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
            <EspressoAppBar crumbs={[{ text: 'Home', link: '/' }]} loading={!state.loaded}>
                <IconButton onClick={onNewItemClick}>
                    <Icon>add_box</Icon>
                </IconButton>
            </EspressoAppBar>

            <div className="route-wrapper">
                <ItemDisplayBlock type="folder" items={state.items} />
                <ItemDisplayBlock type="action-set" items={state.items} />
            </div>

            <NewItemDialog open={state.open} onClose={onClose} onNewItem={onNewItem} />
        </>
    );
};

export default withRouter(FolderRoute);
