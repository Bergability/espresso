// Libraries
import React, { useState, useEffect } from 'react';

// Components
import { Paper } from '@material-ui/core';
import EspressoAppBar from '@components/app-bar';
import api from '@utilities/api';

const SettingsRoute: React.FC = () => {
    const [state, updateState] = useState<any>(null);

    useEffect(() => {
        api.fetch('/app/settings', 'get').then((res) => {
            updateState(res);
        });
    }, []);

    return (
        <>
            <EspressoAppBar crumbs={[{ text: 'Settings', link: '', type: 'link' }]} />

            <div className="route-wrapper">
                {state !== null ? (
                    <Paper className="padded">
                        <p>
                            config path: <pre>{state.config ? state.config : 'n/a'}</pre>
                        </p>
                    </Paper>
                ) : null}
            </div>
        </>
    );
};

export default SettingsRoute;
