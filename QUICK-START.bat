@echo off
title Quick Start Server
color 0A
echo.
echo ========================================
echo   Starting Web Server
echo ========================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Starting Python HTTP server on port 8000...
echo.
python.exe -m http.server 8000
pause



























