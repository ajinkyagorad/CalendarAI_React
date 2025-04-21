// Simple Electron main process file
const electron = require('electron');
const path = require('path');
const url = require('url');

// Module to control application life
const app = electron.app;
// Module to create native browser window
const BrowserWindow = electron.BrowserWindow;

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

  // Load the app - use the Vite dev server URL
  const startUrl = 'http://localhost:5175';
  mainWindow.loadURL(startUrl);

  // Set up IPC handlers for window controls
  electron.ipcMain.on('minimize-app', () => {
    if (mainWindow) mainWindow.minimize();
  });

  electron.ipcMain.on('close-app', () => {
    if (mainWindow) mainWindow.close();
  });

  // Handle window being closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
