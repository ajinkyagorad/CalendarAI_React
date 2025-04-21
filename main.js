const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

// Check if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

function createWindow() {
  // Create the browser window as a floating widget
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 450, // Position near the right edge
    y: 100,        // Position near the top
    frame: false,
    transparent: false, // Start with non-transparent window for better visibility
    backgroundColor: '#121212', // Dark background
    alwaysOnTop: true,
    skipTaskbar: false, // Show in taskbar for easier access
    resizable: true,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets/icon.ico')
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:5173' // Vite dev server
    : url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl);
  
  // Make sure the window is visible
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    console.log('Window should now be visible');
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Show devtools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

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
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it's common to keep the app running
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS re-create a window when dock icon is clicked
  if (mainWindow === null) createWindow();
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
