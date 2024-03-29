import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import isDev from './utils/isDev';
import isMac from '../common/isMac';
import MainService from './services/MainService';
import { makeMainMenu } from './menu/mainMenu';
require('@electron/remote/main').initialize()

let mainWindow = null;
let mainService = null;

if (!app.requestSingleInstanceLock()) {
    app.quit();

} else {
    mainService = new MainService();

    const createWindow = () => {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 200,
            backgroundColor: "#282c34",
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                scrollBounce: true,
                devTools: isDev
            }
        });
        
        mainWindow.loadFile('static/index.html');
        
        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        require("@electron/remote/main").enable(mainWindow.webContents)
        mainWindow.webContents.on('did-finish-load', () => {
            sendAppState(mainService.state);
        });
    }

    app.on('ready', () => {
        createWindow();
        updateMenu(mainService.state);
        mainService.initialize();
        autoUpdater.checkForUpdatesAndNotify();
    });

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
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

    ipcMain.on('log-in', async (event, { login, password }) => {
        const success = await mainService.logIn(login, password);
        event.reply('log-in-result', success);
    });

    ipcMain.on('change-issues-query', async (event, query) => {
        const success = await mainService.setQuery(query);
        event.reply('change-issues-query-result', success);
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
            () => mainService.logOut()
        ));
    };
}