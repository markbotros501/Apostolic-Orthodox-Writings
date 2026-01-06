@echo off
title Launch Site with Server
color 0B
echo.
echo ========================================
echo   Launching Site
echo ========================================
echo.

REM Start server (will request admin if needed)
echo Starting server...
start "" "%~dp0start-server.bat"

REM Wait for server to start
echo Waiting for server to initialize...
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:8000

echo.
echo ========================================
echo   Site Launched!
echo ========================================
echo.
echo If a UAC prompt appeared, click YES to allow
echo the server to start.
echo.
echo The server window must stay open.
echo.
pause


