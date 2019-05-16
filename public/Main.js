const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow () {
    win = new BrowserWindow({
    	width: 800,
    	height: 600,
    	webPreferences: {
  		    nodeIntegration: true
  		}
  	});
    
    if (isDev) {
	    win.loadURL('http://localhost:3000');
	    win.webContents.openDevTools();
	} else {
		win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
	}
}

// TODO добавить стандартный код из Electron по обработке окон и т.п.

app.on('ready', createWindow);