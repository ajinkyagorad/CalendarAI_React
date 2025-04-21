const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  
  // App settings
  setAlwaysOnTop: (value) => ipcRenderer.send('set-always-on-top', value),
  setSkipTaskbar: (value) => ipcRenderer.send('set-skip-taskbar', value),
  
  // Version information
  getAppVersion: () => process.env.npm_package_version || '1.0.0',
  
  // System information
  getPlatform: () => process.platform
});
