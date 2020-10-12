const { app, BrowserWindow,ipcMain } = require('electron')
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

let win;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.autoDownload = true

function createWindow () {
  // Create the browser window.
   win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  autoUpdater.checkForUpdatesAndNotify();
}

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
}); 

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

app.whenReady().then(createWindow)