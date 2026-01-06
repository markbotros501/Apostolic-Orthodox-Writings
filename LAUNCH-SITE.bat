@echo off
REM Launch site with web server (REQUIRED for works to function)
title Launch Site with Server
color 0B

echo.
echo ========================================
echo   Launching Site with Web Server
echo ========================================
echo.
echo Starting server on port 8080...
echo.

REM Try port 8080 first (may not need admin)
cd /d "%~dp0"
start "Web Server - Port 8080" cmd /c "cd /d %~dp0 && powershell.exe -ExecutionPolicy Bypass -File server-alt-port.ps1"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 4 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:8080

echo.
echo ========================================
echo   Server is running!
echo ========================================
echo.
echo The server is running in a separate window.
echo Close that window to stop the server.
echo.
echo Your site should now be open in the browser.
echo All works should now function properly!
echo.
pause



