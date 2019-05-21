const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { join } = require('path');
const isDev = require('./utils/isDev');
const urls = require('./urls');
const core = require('./core');

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#282c34",
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      devTools: isDev
    }
  });
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadURL(`file://${join(__dirname, '../index.html')}`);
  }

  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });

  win.webContents.on('did-finish-load', () => {
    sendAppState();
  });
}

app.on('ready', () => {
  createWindow();
  core.initialize();
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
  if (win === null) {
    createWindow();
  }
});

const sendAppState = () => {
  if (win === null) return;
  win.webContents.send('app-state-updated', core.getState());
};

ipcMain.on('start-tracking', (event, issueId) => {
  core.startTracking(issueId);
});

ipcMain.on('stop-tracking', (event, arg) => {
  core.stopTracking();
});

ipcMain.on('view-issue', (event, idReadable) => {
  shell.openExternal(urls.viewIssue(idReadable));
});

core.events.on('changed', sendAppState);
