# Simple script to open the site in browser
# This opens the HTML file directly without needing a server

$sitePath = Join-Path $PSScriptRoot "index.html"
Invoke-Item $sitePath

Write-Host "Opening site in browser..." -ForegroundColor Green
Write-Host "File: $sitePath" -ForegroundColor Cyan



