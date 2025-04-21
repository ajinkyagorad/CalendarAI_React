// Debug Electron initialization
console.log('Starting Electron debug...');

try {
  const electron = require('electron');
  console.log('Electron loaded successfully');
  console.log('Electron version:', process.versions.electron);
  
  console.log('App object:', electron.app ? 'Available' : 'Not available');
  console.log('BrowserWindow object:', electron.BrowserWindow ? 'Available' : 'Not available');
  
  // Check if we're in the main process
  console.log('Is main process:', electron.app ? true : false);
  
} catch (error) {
  console.error('Error loading Electron:', error);
}
