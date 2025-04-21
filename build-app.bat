@echo off
echo Building AI Gemini Calendar standalone application...
echo This may take a few minutes...

:: Build the application
call npm run build

:: Package as a Windows executable
call npx electron-builder --win portable

echo Done! Look for the executable in the release folder.
pause
