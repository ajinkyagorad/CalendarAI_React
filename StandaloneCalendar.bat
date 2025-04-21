@echo off
echo Starting AI Gemini Calendar...
cd /d "%~dp0"

:: Kill any existing instances
taskkill /f /im electron.exe >nul 2>&1

:: Create a visible window first to show progress
start cmd /c "title AI Gemini Calendar && color 0A && echo. && echo Loading AI Gemini Calendar... && echo. && echo [Please wait while the application starts...] && timeout /t 3 > nul"

:: Set environment variables
set NODE_ENV=production
set ELECTRON_NO_ATTACH_CONSOLE=true

:: Launch the application with special flags to ensure visibility
start "" "node_modules\.bin\electron.cmd" main.js --no-sandbox --disable-gpu-sandbox

:: Show instructions
echo.
echo Application launched! 
echo.
echo The calendar should appear in the top-right corner of your screen.
echo If you don't see it, press Alt+Space to toggle visibility.
echo.
echo Note: You can also find it in your taskbar.
echo.
pause
