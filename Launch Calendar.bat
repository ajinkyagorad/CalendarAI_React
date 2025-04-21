@echo off
echo Starting AI Gemini Calendar...
cd /d "%~dp0"

:: Start the Vite development server
start /b cmd /c "npm run dev"

:: Wait for the server to start
timeout /t 5 /nobreak > nul

:: Start the Electron app
start /b cmd /c "npx electron electron.js"

echo Application launched! Look for the floating widget on your screen.
echo If you don't see it, press Alt+Space to toggle its visibility.
