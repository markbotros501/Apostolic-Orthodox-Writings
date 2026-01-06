@echo off
title HTTP Server - Port 8080
color 0A
echo.
echo ========================================
echo   Starting HTTP Server
echo ========================================
echo.
echo Server will be available at:
echo   http://localhost:8080
echo.
echo IMPORTANT: This window must stay open!
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -NoExit -File ".\simple-server.ps1" -Port 8080

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
    pause
)

