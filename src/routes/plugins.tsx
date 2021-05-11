import React, { useEffect, useState } from 'react';
import EspressoAppBar, { Crumb } from '@components/app-bar';
import { Paper, Typography, Button, Icon } from '@material-ui/core';
import { GetPluginsPayload } from '@typings/api';
import api from '@utilities/api';

import './plugins.scss';
import { openInBrowser } from '@utilities';

const PluginRoute: React.FC = () => {
    const [state, updateState] = useState<GetPluginsPayload | null>(null);

    useEffect(() => {
        api.fetch<GetPluginsPayload>('/plugins', 'get')
            .then(updateState)
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const crumbs: Crumb[] = [
        {
            text: 'My Items',
            link: '/',
            type: 'folder',
        },
        {
            text: 'Plugins',
            link: '/plugins',
            type: 'link',
        },
    ];

    const onAddClick = () => {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.click();

        input.onchange = (e) => {
            // @ts-ignore
            if (e.target.files.length > 0) {
                // @ts-ignore
                const path: string = e.target.files[0].path;

                api.fetch<GetPluginsPayload>('/plugins', 'post', JSON.stringify({ path }))
                    .then(updateState)
                    .catch((e) => {
                        console.log(e);
                    });
            }
        };
    };

    const deletePlugin = (slug: string) => {
        api.fetch<GetPluginsPayload>(`/plugins/${slug}`, 'delete')
            .then(updateState)
            .catch((e) => {
                console.log(e);
            });
    };

    const onRestartClick = () => {
        api.fetch<GetPluginsPayload>('/app/restart', 'post').catch((e) => {
            console.log(e);
        });
    };

    if (state === null) return <EspressoAppBar crumbs={[]} />;

    return (
        <>
            <EspressoAppBar crumbs={crumbs} />

            <div className="route-wrapper">
                <Paper className="padded">
                    <div className="espresso-plugin-actions">
                        <Typography variant="h6">Plugins</Typography>
                        <div>
                            <Button variant="outlined" onClick={onRestartClick} style={{ marginRight: 15 }}>
                                Reload Espresso
                            </Button>
                            <Button variant="contained" color="primary" onClick={onAddClick}>
                                Add plugin
                            </Button>
                        </div>
                    </div>

                    <div className="espresso-plugin-list">
                        {state.length === 0 ? (
                            <Typography>No plugins are active</Typography>
                        ) : (
                            state.map((plugin) => (
                                <div key={plugin.slug} className="espresso-plugin">
                                    <div>
                                        <Typography className="espresso-plugin-name">
                                            {plugin.name} <span className="espresso-plugin-version">{plugin.version}</span>
                                        </Typography>
                                        <Typography variant="caption" className="espresso-plugin-path">
                                            {plugin.path}
                                        </Typography>
                                    </div>

                                    <div>
                                        {plugin.settings ? (
                                            <Button
                                                variant="outlined"
                                                style={{ marginRight: 15 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    openInBrowser(plugin.settings as string);
                                                }}
                                            >
                                                Settings
                                            </Button>
                                        ) : null}
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                deletePlugin(plugin.slug);
                                            }}
                                        >
                                            Remove plugin{' '}
                                            <Icon fontSize="small" style={{ marginLeft: 10 }}>
                                                delete
                                            </Icon>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Paper>
            </div>
        </>
    );
};

export default PluginRoute;
