@echo off
REM Launch site with web server (required for works to function)
REM This starts the server and opens the browser

title Launch Site
color 0B

echo Starting web server and opening browser...
echo.

REM Start server in background window
start "Web Server - Port 8000" cmd /c "cd /d %~dp0 && powershell.exe -ExecutionPolicy Bypass -File server.ps1"

REM Wait for server to start
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:8000

echo.
echo Server is running in a separate window.
echo Close that window to stop the server.
echo.
echo Site should now be open in your browser.
echo.
pause

