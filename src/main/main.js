import { app, BrowserWindow, ipcMain, Menu, shell, powerMonitor } from 'electron';
import { autoUpdater } from 'electron-updater';
import isDev from './utils/isDev';
import isMac from '../common/isMac';
import urls from '../common/urls';
import MainService from './services/MainService';
import { makeMainMenu } from './menu/mainMenu';

let mainWindow = null;
const mainService = new MainService();

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 200,
        backgroundColor: "#282c34",
        webPreferences: {
            nodeIntegration: true,
            scrollBounce: true,
            devTools: isDev
        }
    });
    
    mainWindow.loadFile('static/index.html');
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
    mainWindow.webContents.on('did-finish-load', () => {
        sendAppState(mainService.state);
    });
}

app.on('ready', () => {
    createWindow();
    updateMenu(mainService.state);

    mainService.initialize();
    autoUpdater.checkForUpdatesAndNotify();

    powerMonitor.on('unlock-screen', () => {
        mainService.activateApp();
        if (mainService.idleWarningIsShown) {
            app.focus();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS
    if (mainWindow === null) {
        createWindow();
    }
});

const sendAppState = (appState) => {
    if (mainWindow === null) return;
    mainWindow.webContents.send('app-state-updated', appState);
};

ipcMain.on('start-tracking', (event, issueId) => {
    mainService.startTracking(issueId);
});

ipcMain.on('stop-tracking', (event, arg) => {
    mainService.stopTracking();
});

ipcMain.on('add-work-item', (event, item) => {
    mainService.addWorkItem(item);
});

ipcMain.on('accept-idle-time', (event, arg) => {
    mainService.acceptIdleTime();
});

ipcMain.on('subtract-idle-time', (event, arg) => {
    mainService.subtractIdleTime();
});

ipcMain.on('logIn', (event, { login, password }) => {
    mainService.logIn(login, password);
});

mainService.on('changed', () => {
    const state = mainService.state;
    sendAppState(state);
    updateMenu(state);
});

const updateMenu = (appState) => {
    Menu.setApplicationMenu(makeMainMenu(
        appState,
        () => mainService.reloadIssues(),
        () => mainService.logOut(),
        () => shell.openExternal(urls.viewAllIssues)
    ));
};
    