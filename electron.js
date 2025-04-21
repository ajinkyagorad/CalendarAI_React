// Electron main process file
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window as a floating widget
  mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the app
  const startUrl = app.isPackaged 
    ? url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    : 'http://localhost:5178';

  mainWindow.loadURL(startUrl);

  // Set up IPC handlers for window controls
  ipcMain.on('minimize-app', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('close-app', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on('set-always-on-top', (_, value) => {
    if (mainWindow) mainWindow.setAlwaysOnTop(value);
  });

  ipcMain.on('set-skip-taskbar', (_, value) => {
    if (mainWindow) mainWindow.setSkipTaskbar(value);
  });

  // Handle window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
