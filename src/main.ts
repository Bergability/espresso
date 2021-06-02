import { app, BrowserWindow, autoUpdater, dialog } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

const server = 'https://releases.espresso.gg';
const url = `${server}/update/${process.platform}/0.0.2`;

if (!isDev) {
    autoUpdater.setFeedURL({ url });
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 30 * 60 * 1000);

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.',
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
    });

    autoUpdater.on('error', (message) => {
        console.error('There was a problem updating the application');
        console.error(message);
    });
}

import './core/espresso';
import './registrations';

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        backgroundColor: '#303030',
        title: 'Espresso',
        // frame: false,
        // titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', () => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
