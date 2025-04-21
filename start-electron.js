// Script to start Electron
const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');

// Get the path to the Electron executable
const electronPath = electron;

// Start Electron with our main.js file
const child = spawn(electronPath, [path.join(__dirname, 'main-widget.js')], {
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(code);
});
