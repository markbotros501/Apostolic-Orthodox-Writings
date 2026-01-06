@echo off
title Web Server - Port 8000
color 0A
echo.
echo ========================================
echo   Starting Web Server
echo ========================================
echo.
echo This window MUST stay open!
echo.
echo Server: http://localhost:8000
echo.
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Try to start the PowerShell server
powershell.exe -ExecutionPolicy Bypass -NoExit -Command "& { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); try { $listener.Start(); Write-Host 'Server running at http://localhost:8000' -ForegroundColor Green; Write-Host 'Serving from:' (Get-Location) -ForegroundColor Cyan; $rootPath = Get-Location; while ($listener.IsListening) { try { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $response.AddHeader('Access-Control-Allow-Origin', '*'); $localPath = $request.Url.LocalPath; if ($localPath -eq '/') { $localPath = '/index.html' }; $relativePath = $localPath.TrimStart('/').Replace('/', '\'); $filePath = Join-Path $rootPath $relativePath; if (Test-Path $filePath -PathType Leaf) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $ext = [System.IO.Path]::GetExtension($filePath).ToLower(); $contentType = switch ($ext) { '.html' { 'text/html; charset=utf-8' }; '.css' { 'text/css' }; '.js' { 'application/javascript' }; '.json' { 'application/json' }; default { 'application/octet-stream' } }; $response.ContentType = $contentType; $response.StatusCode = 200; $response.OutputStream.Write($content, 0, $content.Length); Write-Host \"200 OK: $localPath\" -ForegroundColor Green } else { $response.StatusCode = 404; $notFound = [System.Text.Encoding]::UTF8.GetBytes(\"404 Not Found: $localPath\"); $response.ContentLength64 = $notFound.Length; $response.ContentType = 'text/plain'; $response.OutputStream.Write($notFound, 0, $notFound.Length); Write-Host \"404: $localPath\" -ForegroundColor Red }; $response.Close() } catch { Write-Host \"Error: $_\" -ForegroundColor Red; if ($response) { try { $response.StatusCode = 500; $response.Close() } catch {} } } } } catch { Write-Host \"ERROR: Could not start server!\" -ForegroundColor Red; Write-Host \"You may need to run as Administrator\" -ForegroundColor Yellow; Write-Host \"Error: $_\" -ForegroundColor Red; pause } }"

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
    echo Try right-clicking this file and selecting
    echo "Run as administrator"
    echo.
    pause
)



