// Libraries
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import EspressoAppBar from '@components/app-bar';

// Utilities
import api from '@utilities/api';

// Types
import { RouteComponentProps } from 'react-router-dom';
import { GetItemPayload } from '@typings/api';
import EspressoForm from '@components/form/form';
import { Input } from '@typings/inputs';
import { List } from '@typings/items';
import { Paper } from '@material-ui/core';

interface Params {
    id: string;
}

const ListRoute: React.FC<RouteComponentProps<Params>> = (props) => {
    const id = props.match.params.id;
    const [state, updateState] = useState<GetItemPayload | null>(null);

    useEffect(() => {
        api.fetch<GetItemPayload>(`/items/${id}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [id]);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const inputs: Input<List>[] = [
        {
            type: 'text',
            key: 'name',
            label: 'List name',
            default: '',
        },
        {
            type: 'chips',
            key: 'items',
            label: 'List items',
            default: [],
            emptyText: 'No items in list',
        },
    ];

    const onChange = (key: string, value: any) => {
        updateState({
            ...state,
            item: {
                ...state.item,
                [key]: value,
            },
        });
    };

    const onSave = (data: List) => {
        api.fetch(`/items/${id}`, 'put', JSON.stringify(data));
    };

    state.crumbs[state.crumbs.length - 1].text = state.item.name;

    return (
        <>
            <EspressoAppBar crumbs={state.crumbs} />
            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<List> data={state.item as List} inputs={inputs} onChange={onChange} onSave={onSave} variant="outlined" />
                </Paper>
            </div>
        </>
    );
};

export default withRouter(ListRoute);
