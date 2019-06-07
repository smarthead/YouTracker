import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron';
import isDev from './utils/isDev';
import urls from './services/urls';
import MainService from './services/MainService';

let mainWindow = null;
const mainService = new MainService();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 200,
    backgroundColor: "#282c34",
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      devTools: isDev
    }
  });
  
  mainWindow.loadFile('build/renderer/index.html');

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
});

app.on('window-all-closed', () => {
  // macOS
  if (process.platform !== 'darwin') {
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

ipcMain.on('view-issue', (event, idReadable) => {
  shell.openExternal(urls.viewIssue(idReadable));
});

ipcMain.on('add-work-item', (event, item) => {
  mainService.addWorkItem(item);
});

ipcMain.on('logIn', (event, { login, password }) => {
  mainService.logIn(login, password);
});

mainService.on('changed', () => {
  const state = mainService.state;
  sendAppState(state);
  updateMenu(state);
});

// TODO:
// - Вынести в отдельный файл
// - Для разных ОС — разное меню. Например, appMenu — только на macOS
// - Локализовать — написать по-русски, сделать чтобы системные меню были на русском
const updateMenu = (appState) => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { role: 'appMenu' },
    { role: 'editMenu' },
    {
      label: 'Account',
      submenu: [
        {
          label: 'Log out',
          enabled: appState.isAuthorized,
          click: () => mainService.logOut()
        }
      ],
    },
    {
      label: 'Issues',
      submenu: [
        {
          label: 'Reload',
          enabled: appState.isAuthorized,
          click: () => mainService.reloadIssues()
        }
      ],
    }
  ]));
};
