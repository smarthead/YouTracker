import { app, BrowserWindow, ipcMain, shell } from 'electron';
import isDev from './utils/isDev';
import urls from './services/urls';
import MainService from './services/MainService';

let mainWindow = null;
const mainService = new MainService();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#282c34",
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      devTools: isDev
    }
  });
  
  mainWindow.loadFile('build/renderer/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    sendAppState();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  mainService.initialize();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const sendAppState = () => {
  if (mainWindow === null) return;
  mainWindow.webContents.send('app-state-updated', mainService.state);
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

mainService.on('changed', sendAppState);
