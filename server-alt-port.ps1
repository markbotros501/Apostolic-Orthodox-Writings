# Alternative server on port 8080 (may not require admin)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
try {
    $listener.Start()
    Write-Host "Server running at http://localhost:8080" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Write-Host "Try running as administrator or use port 8080" -ForegroundColor Yellow
    pause
    exit
}

# Get the directory where the script is located
$rootPath = $PSScriptRoot
if ([string]::IsNullOrEmpty($rootPath)) {
    $rootPath = Get-Location
}
Write-Host "Serving from: $rootPath" -ForegroundColor Cyan

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Add CORS headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        # Clean up the path and convert to Windows format
        $relativePath = $localPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $rootPath $relativePath
        
        # Debug output
        Write-Host "Request: $localPath -> $filePath" -ForegroundColor Gray
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Set content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css" }
                ".js" { "application/javascript" }
                ".json" { "application/json" }
                ".png" { "image/png" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg" { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.StatusCode = 200
            
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "200 OK: $localPath" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.ContentLength64 = $notFound.Length
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            Write-Host "404 Not Found: $localPath ($filePath)" -ForegroundColor Red
        }
        
        $response.Close()
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        if ($response) {
            try {
                $response.StatusCode = 500
                $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error: $_")
                $response.ContentLength64 = $errorMsg.Length
                $response.ContentType = "text/plain"
                $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
                $response.Close()
            } catch {
                # Ignore errors when closing response
            }
        }
    }
}



