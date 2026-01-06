@echo off
REM This script starts the server AND opens the browser
title Launch Site with Server
color 0B

echo Starting server and opening browser...
echo.

REM Start server in background
start "Web Server" cmd /c "cd /d %~dp0 && powershell.exe -ExecutionPolicy Bypass -File server.ps1"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:8000

echo.
echo Server is running in a separate window.
echo Close that window to stop the server.
echo.
pause



