const { app } = require('electron');

const isDev = !app.isPackaged;
module.exports = isDev;