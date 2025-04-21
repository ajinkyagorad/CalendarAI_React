@echo off
echo Starting AI Gemini Calendar...
cd /d "%~dp0"

:: Kill any existing instances of the app
taskkill /f /im electron.exe >nul 2>&1

:: Start the app in standalone mode
start "" "release\win-unpacked\electron.exe"

echo Application launched! Look for the floating widget on your screen.
echo Press Alt+Space to toggle visibility if you don't see it.
