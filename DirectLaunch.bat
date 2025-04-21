@echo off
echo Starting AI Gemini Calendar...
cd /d "%~dp0"

:: Kill any existing instances
taskkill /f /im electron.exe >nul 2>&1

:: Set environment variables to ensure proper startup
set NODE_ENV=production

:: Launch the application directly
start "" "node_modules\.bin\electron.cmd" main.js

echo Application launched! Look for the floating widget on your screen.
echo If you don't see it, press Alt+Space to toggle its visibility.
echo.
echo Note: The window is transparent and may be difficult to see at first.
echo It should appear in the top-right corner of your screen.
pause
