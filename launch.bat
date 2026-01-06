@echo off
title Launch Site
color 0B
echo.
echo ========================================
echo   Launching Site
echo ========================================
echo.

cd /d "%~dp0"

REM Start server in new window
echo Starting server...
start "Web Server - DO NOT CLOSE" "%~dp0START-SERVER-NOW.bat"

REM Wait for server
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:8000

echo.
echo ========================================
echo   Site Launched!
echo ========================================
echo.
echo The server is running in a separate window.
echo Keep that window open while using the site.
echo.
echo Your browser should now be open.
echo.
echo If works don't load, make sure the server
echo window is still running!
echo.
pause


