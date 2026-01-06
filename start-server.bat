@echo off
REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title Web Server - Port 8000
color 0A
echo.
echo ========================================
echo   Starting Web Server on Port 8000
echo ========================================
echo.
echo Server will be available at:
echo   http://localhost:8000
echo.
echo IMPORTANT: This window must stay open!
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -NoExit -File "%~dp0simple-server.ps1"

if errorlevel 1 (
    echo.
    echo ERROR: Could not start server!
    echo.
    pause
)

