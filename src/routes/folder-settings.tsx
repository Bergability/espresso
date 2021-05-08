// Libraries
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import { Paper } from '@material-ui/core';

// Types
import { RouteComponentProps } from 'react-router-dom';
import EspressoAppBar from '@components/app-bar';
import api from '@utilities/api';
import { GetFolderPayload } from '@typings/api';
import { Folder } from '@typings/items';
import EspressoForm from '@components/form/form';
import { Input } from '@typings/inputs';

interface RouteParams {
    id: string;
}

const FolderSettingsRoute: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const [state, updateState] = useState<GetFolderPayload | null>(null);
    const id = props.match.params.id;

    useEffect(() => {
        api.fetch<GetFolderPayload>(`/folder/${id}`, 'get')
            .then((res) => {
                updateState(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [id]);

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    const onSave = (data: Folder) => {
        api.fetch(`/items/${id}`, 'put', JSON.stringify(data)).catch((e) => {
            console.log(e);
        });
    };

    const onChange = (key: keyof Folder, value: any) => {
        updateState({
            ...state,
            folder: {
                ...state.folder,
                [key]: value,
            },
        });
    };

    const inputs: Input<Folder>[] = [
        {
            type: 'text',
            key: 'name',
            label: 'Folder name',
            default: '',
        },
        {
            type: 'color',
            key: 'color',
            label: 'Color',
            default: '#ff00ff',
        },
    ];

    state.crumbs[state.crumbs.length - 1].text = state.folder.name;

    return (
        <>
            <EspressoAppBar crumbs={[...state.crumbs, { text: 'Settings', link: '', type: 'link' }]} />

            <div className="route-wrapper">
                <Paper className="padded">
                    <EspressoForm<Folder> data={state.folder} inputs={inputs} onSave={onSave} onChange={onChange} />
                </Paper>
            </div>
        </>
    );
};

export default withRouter(FolderSettingsRoute);
