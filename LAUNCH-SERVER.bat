@echo off
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
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
python.exe -m http.server 8000

if errorlevel 1 (
    echo.
    echo ERROR: Could not start server!
    echo.
    echo Make sure Python is installed and in your PATH.
    echo.
    pause
)




