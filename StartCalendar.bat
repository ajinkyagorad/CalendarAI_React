@echo off
echo Starting AI Gemini Calendar...
cd /d "%~dp0"

:: Kill any existing instances
taskkill /f /im electron.exe >nul 2>&1

:: Set environment variables for production mode
set NODE_ENV=production

:: Launch the application with visibility flags
start "" "node_modules\.bin\electron.cmd" main.js --force-device-scale-factor=1.0 --high-dpi-support=1

echo.
echo Application launched!
echo.
echo The calendar should now be visible on your screen.
echo If you don't see it, check your taskbar for the application icon.
echo.
echo Press any key to exit this launcher...
pause > nul
